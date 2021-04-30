const { Version } = require('../../utils/version');
const { PackageService, AlreadyPublishedError } = require('../packageService');
const { Pool, clientRelease } = require('./stubs/pool');

const MOCK_PACKAGE_NAME = 'mockPackage';
const MOCK_PACKAGE_VERSION = '1.2';
const MOCK_PACKAGE_INFO = {
    internal_id: 1,
    sfdc_id: 'mockId',
    version: MOCK_PACKAGE_VERSION
};

describe('packageService', () => {
    describe('findPackageVersion', () => {
        it('works when package is found', async () => {
            const pool = new Pool([[MOCK_PACKAGE_INFO]]);
            const service = new PackageService(pool);

            const packageInfo = await service.findPackageVersion(
                MOCK_PACKAGE_NAME,
                MOCK_PACKAGE_VERSION
            );

            expect(clientRelease).toHaveBeenCalled();
            expect(packageInfo).toEqual(MOCK_PACKAGE_INFO);
        });

        it('works when package is not found', async () => {
            const pool = new Pool([[]]);
            const service = new PackageService(pool);

            const packageInfo = await service.findPackageVersion(
                MOCK_PACKAGE_NAME,
                MOCK_PACKAGE_VERSION
            );

            expect(clientRelease).toHaveBeenCalled();
            expect(packageInfo).toBeNull();
        });
    });

    describe('findLatestStablePackageVersion', () => {
        it('works when package is found', async () => {
            const pool = new Pool([[MOCK_PACKAGE_INFO]]);
            const service = new PackageService(pool);

            const packageInfo = await service.findLatestStablePackageVersion(
                MOCK_PACKAGE_NAME
            );

            expect(clientRelease).toHaveBeenCalled();
            expect(packageInfo).toEqual(MOCK_PACKAGE_INFO);
        });

        it('works when package is not found', async () => {
            const pool = new Pool([[]]);
            const service = new PackageService(pool);

            const packageInfo = await service.findLatestStablePackageVersion(
                MOCK_PACKAGE_NAME
            );

            expect(clientRelease).toHaveBeenCalled();
            expect(packageInfo).toBeNull();
        });
    });

    describe('findLatestBetaPackageVersion', () => {
        it('finds beta version', async () => {
            const pool = new Pool([[MOCK_PACKAGE_INFO], []]);
            const service = new PackageService(pool);

            const packageInfo = await service.findLatestBetaPackageVersion(
                MOCK_PACKAGE_NAME
            );

            expect(clientRelease).toHaveBeenCalled();
            expect(packageInfo).toEqual(MOCK_PACKAGE_INFO);
        });

        it('finds stable version', async () => {
            const pool = new Pool([[], [MOCK_PACKAGE_INFO]]);
            const service = new PackageService(pool);

            const packageInfo = await service.findLatestBetaPackageVersion(
                MOCK_PACKAGE_NAME
            );

            expect(clientRelease).toHaveBeenCalled();
            expect(packageInfo).toEqual(MOCK_PACKAGE_INFO);
        });

        it('works when package is not found', async () => {
            const pool = new Pool([[], []]);
            const service = new PackageService(pool);

            const packageInfo = await service.findLatestBetaPackageVersion(
                MOCK_PACKAGE_NAME
            );

            expect(clientRelease).toHaveBeenCalled();
            expect(packageInfo).toBeNull();
        });
    });

    describe('trackInstall', () => {
        it('works', async () => {
            const pool = new Pool([[MOCK_PACKAGE_INFO]]);
            const service = new PackageService(pool);

            await service.trackInstall(null);

            expect(clientRelease).toHaveBeenCalled();
        });
    });

    describe('assertVersionIsNotPublished', () => {
        it('works when version is not published', async () => {
            const pool = new Pool([[]]);
            const service = new PackageService(pool);

            await service.assertVersionIsNotPublished(null);

            expect(clientRelease).toHaveBeenCalled();
        });

        it('throws AlreadyPublishedError when version is published', async () => {
            const pool = new Pool([[MOCK_PACKAGE_INFO]]);
            const service = new PackageService(pool);

            await expect(async () => {
                return service.assertVersionIsNotPublished(null);
            }).rejects.toThrow(AlreadyPublishedError);
            expect(clientRelease).toHaveBeenCalled();
        });
    });

    describe('getPackageVersion', () => {
        it('works when id is not null', async () => {
            const pool = new Pool([
                [
                    {
                        version: MOCK_PACKAGE_VERSION
                    }
                ]
            ]);
            const client = await pool.connect();
            const service = new PackageService(pool);

            const version = await service.getPackageVersion(client, 666);

            expect(version).toEqual(Version.fromString(MOCK_PACKAGE_VERSION));
        });

        it('works when id is null', async () => {
            const pool = new Pool([[]]);
            const client = await pool.connect();
            const service = new PackageService(pool);

            const version = await service.getPackageVersion(client, null);

            expect(version).toBeNull();
        });
    });
});
