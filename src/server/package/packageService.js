const { Version } = require('../utils/version');

class PackageService {
    constructor(pool) {
        this.pool = pool;
    }

    /**
     * Tries to find a package version with the given package name and version
     * @param {string} packageName
     * @param {string} version
     * @returns package version or null if not found
     */
    async findPackageVersion(packageName, version) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(
                `SELECT pv.id as internal_id, sfdc_id, version
FROM package_definitions pd, package_versions pv
WHERE pd.id = pv.package_definition_id AND pd.name = $1 AND pv.version = $2`,
                [packageName, version]
            );
            return result.rowCount === 0 ? null : result.rows[0];
        } finally {
            client.release();
        }
    }

    /**
     * Tries to find the latest stable package version for the given package name
     * @param {string} packageName
     * @returns package version or null if not found
     */
    async findLatestStablePackageVersion(packageName) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(
                `SELECT pv.id as internal_id, sfdc_id, version
FROM package_definitions pd, package_versions pv
WHERE pd.latest_stable_version_id = pv.id AND pd.name = $1`,
                [packageName]
            );
            return result.rowCount === 0 ? null : result.rows[0];
        } finally {
            client.release();
        }
    }

    /**
     * Tries to find the latest beta package version for the given package name
     * If no beta is found, it will fall back to the latest stable version
     * @param {string} packageName
     * @returns package version or null if not found
     */
    async findLatestBetaPackageVersion(packageName) {
        const client = await this.pool.connect();
        try {
            let result = await client.query(
                `SELECT pv.id as internal_id, sfdc_id, version
FROM package_definitions pd, package_versions pv
WHERE pd.latest_beta_version_id = pv.id AND pd.name = $1`,
                [packageName]
            );
            // Fall back to latest stable if no beta found
            if (result.rowCount === 0) {
                result = await client.query(
                    `SELECT pv.id as internal_id, sfdc_id, version
FROM package_definitions pd, package_versions pv
WHERE pd.latest_stable_version_id = pv.id AND pd.name = $1`,
                    [packageName]
                );
            }
            return result.rowCount === 0 ? null : result.rows[0];
        } finally {
            client.release();
        }
    }

    /**
     * Tracks package installation
     * @param {number} packageVersionId
     */
    async trackInstall(packageVersionId) {
        const client = await this.pool.connect();
        try {
            await client.query(
                `INSERT INTO install_metrics (package_version_id) VALUES ($1)`,
                [packageVersionId]
            );
        } finally {
            client.release();
        }
    }

    /**
     * Checks that a package version is not yet published
     * @param {string} versionId Salesforce package version id
     * @throws AlreadyPublishedError if the package is already published
     */
    async assertVersionIsNotPublished(versionId) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(
                `SELECT id FROM package_versions WHERE sfdc_id = $1`,
                [versionId]
            );
            if (result.rowCount === 1) {
                throw new AlreadyPublishedError();
            }
        } finally {
            client.release();
        }
    }

    /**
     * Publishes a package to the registry
     * @param {object} packageInfo
     */
    async publishPackageVersion(packageInfo) {
        const client = await this.pool.connect();
        try {
            // Get package definition from its name
            let result = await client.query(
                `SELECT id, latest_stable_version_id, latest_beta_version_id FROM package_definitions WHERE name = $1`,
                [packageInfo.name]
            );
            let packageDefinition =
                result.rowCount === 0 ? null : result.rows[0];
            // Open transaction
            await client.query('BEGIN');
            // Insert package definition if needed
            if (!packageDefinition) {
                result = await client.query(
                    `INSERT INTO package_definitions (name, publisher, description) VALUES
                    ($1, $2, $3) RETURNING id`,
                    [
                        packageInfo.name,
                        packageInfo.publisher,
                        packageInfo.description
                    ]
                );
                packageDefinition = result.rows[0];
                packageDefinition.latest_stable_version_id = null;
                packageDefinition.latest_beta_version_id = null;
            }
            // Insert package version
            result = await client.query(
                `INSERT INTO package_versions (sfdc_id, package_definition_id, name, version) VALUES
                ($1, $2, $3, $4) RETURNING id`,
                [
                    packageInfo.id,
                    packageDefinition.id,
                    packageInfo.name,
                    packageInfo.versionNumber
                ]
            );
            const newPackageVersionId = result.rows[0].id;
            // Get versions
            const newVersion = Version.fromString(packageInfo.versionNumber);
            const latestStableVersion = await this.getPackageVersion(
                client,
                packageDefinition.latest_stable_version_id
            );
            const latestBetaVersion = await this.getPackageVersion(
                client,
                packageDefinition.latest_beta_version_id
            );
            let newLatestStableVersionId, newLatestBetaVersionId;
            let shouldUpdatePackageDef = false;
            // Update latest stable package version if needed
            if (
                newVersion.beta === null &&
                newVersion.isGreater(latestStableVersion)
            ) {
                newLatestStableVersionId = newPackageVersionId;
                newLatestBetaVersionId = null;
                shouldUpdatePackageDef = true;
            }
            // Update latest beta package version if needed
            else if (
                newVersion.beta !== null &&
                newVersion.isGreater(latestStableVersion) &&
                newVersion.isGreater(latestBetaVersion)
            ) {
                newLatestStableVersionId =
                    packageDefinition.latest_stable_version_id;
                newLatestBetaVersionId = newPackageVersionId;
                shouldUpdatePackageDef = true;
            }
            if (shouldUpdatePackageDef) {
                await client.query(
                    `UPDATE package_definitions SET latest_stable_version_id = $1, latest_beta_version_id = $2 WHERE id = $3`,
                    [
                        newLatestStableVersionId,
                        newLatestBetaVersionId,
                        packageDefinition.id
                    ]
                );
            }
            // Commit transaction
            await client.query('COMMIT');
        } catch (e) {
            // Rollback transaction in case of error
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    /**
     * Gets the version of a package
     * @param {object} client database client
     * @param {number} id package internal id
     * @returns package version or null if internal id is null
     */
    async getPackageVersion(client, id) {
        if (id === null) {
            return null;
        }
        const result = await client.query(
            `SELECT version FROM package_versions WHERE id = $1`,
            [id]
        );
        return Version.fromString(result.rows[0].version);
    }
}

class AlreadyPublishedError extends Error {}

module.exports = {
    PackageService,
    AlreadyPublishedError
};
