const { PackageService, AlreadyPublishedError } = require('./packageService');
const { PackageInfoParser, PackageInfoError } = require('./packageInfoParser');

const REGEX_SALESFORCE_ID = /04t[a-zA-Z0-9]{12}/;

module.exports = class PackageRestResource {
    constructor(pool) {
        this.packageService = new PackageService(pool);
    }

    async getPackageVersion(req, res) {
        if (!req.query.package_name) {
            res.statusMessage = 'Missing package name parameter';
            res.sendStatus(400);
            return;
        }
        const { package_name, version } = req.query;
        const shouldIncludeBeta =
            req.query['include-beta'] && req.query['include-beta'] === 'true';

        try {
            let packageVersion;
            if (version) {
                // Specific version
                packageVersion = await this.packageService.findPackageVersion(
                    package_name,
                    version
                );
            } else if (shouldIncludeBeta) {
                // Latest beta
                packageVersion = await this.packageService.findLatestBetaPackageVersion(
                    package_name
                );
            } else {
                // Latest stable
                packageVersion = await this.packageService.findLatestStablePackageVersion(
                    package_name
                );
            }
            // Save & hide internal package version id
            let packageVersionId;
            if (packageVersion && packageVersion.internal_id) {
                packageVersionId = packageVersion.internal_id;
                delete packageVersion.internal_id;
            }
            // Return package version
            res.json(packageVersion);
            // Track install asynchronously
            if (packageVersionId) {
                this.packageService.trackInstall(packageVersionId);
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        }
    }

    async publishPackageVersion(req, res) {
        if (!req.params.versionId) {
            res.statusMessage = 'Missing package version ID parameter';
            res.sendStatus(400);
            return;
        }
        const { versionId } = req.params;
        if (!REGEX_SALESFORCE_ID.test(versionId)) {
            res.statusMessage = 'Invalid package version ID format';
            res.sendStatus(400);
            return;
        }

        try {
            // Make sure package version isn't published yet
            await this.packageService.assertVersionIsNotPublished(versionId);
            // Get package info from Salesforce
            const packageInfo = await PackageInfoParser.parsePackageInfo(
                versionId
            );
            // Publish package version
            await this.packageService.publishPackageVersion(packageInfo);
            // Return package info
            res.json(packageInfo);
        } catch (error) {
            if (error instanceof AlreadyPublishedError) {
                res.statusMessage = 'Package version is already published';
                res.sendStatus(403);
                return; // Don't log this error in order to avoid noise
            }
            // Log other errors
            console.error(error);
            if (error instanceof PackageInfoError) {
                res.statusMessage = 'Salesforce error';
                res.status(424).json({ errors: error.getErrors() });
            } else {
                res.sendStatus(500);
            }
        }
    }
};
