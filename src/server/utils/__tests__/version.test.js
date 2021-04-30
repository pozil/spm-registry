const { Version } = require('../version');

const VERSION_1 = new Version(1, 0, null);
const VERSION_2 = new Version(2, 0, null);
const VERSION_2_3 = new Version(2, 3, null);
const VERSION_2_3_BETA_4 = new Version(2, 3, 4);
const VERSION_2_3_BETA_5 = new Version(2, 3, 5);
const VERSION_STRING_2_3 = '2.3';
const VERSION_STRING_2_3_BETA_4 = '2.3 (Beta 4)';

describe('version', () => {
    it('parses version string without beta', () => {
        const version = Version.fromString(VERSION_STRING_2_3);
        expect(version.major).toBe(2);
        expect(version.minor).toBe(3);
        expect(version.beta).toBeNull();
    });

    it('parses version string with beta', () => {
        const version = Version.fromString(VERSION_STRING_2_3_BETA_4);
        expect(version.major).toBe(2);
        expect(version.minor).toBe(3);
        expect(version.beta).toBe(4);
    });

    it('parses null version string', () => {
        const version = Version.fromString(null);
        expect(version).toBeNull();
    });

    it('can convert to string without beta', () => {
        const versionString = VERSION_2_3.toString();
        expect(versionString).toBe(VERSION_STRING_2_3);
    });

    it('can convert to string with beta', () => {
        const versionString = VERSION_2_3_BETA_4.toString();
        expect(versionString).toBe(VERSION_STRING_2_3_BETA_4);
    });

    describe('isGreater', () => {
        it('works when the other version is null', () => {
            const isGreater = VERSION_1.isGreater(null);
            expect(isGreater).toBeTruthy();
        });

        it('works when the other major version is greater', () => {
            const isGreater = VERSION_1.isGreater(VERSION_2);
            expect(isGreater).toBeFalsy();
        });

        it('works when the other major version is lesser', () => {
            const isGreater = VERSION_2.isGreater(VERSION_1);
            expect(isGreater).toBeTruthy();
        });

        it('works when the other minor version is greater', () => {
            const isGreater = VERSION_2.isGreater(VERSION_2_3);
            expect(isGreater).toBeFalsy();
        });

        it('works when the other minor version is lesser', () => {
            const isGreater = VERSION_2_3.isGreater(VERSION_2);
            expect(isGreater).toBeTruthy();
        });

        it('works when this version has no beta and the other beta version is greater', () => {
            const isGreater = VERSION_2_3.isGreater(VERSION_2_3_BETA_4);
            expect(isGreater).toBeFalsy();
        });

        it('works when this version has a beta and the other has none', () => {
            const isGreater = VERSION_2_3_BETA_4.isGreater(VERSION_2_3);
            expect(isGreater).toBeTruthy();
        });

        it('works when the other beta version is greater', () => {
            const isGreater = VERSION_2_3_BETA_4.isGreater(VERSION_2_3_BETA_5);
            expect(isGreater).toBeFalsy();
        });

        it('works when the other beta version is lesser', () => {
            const isGreater = VERSION_2_3_BETA_5.isGreater(VERSION_2_3_BETA_4);
            expect(isGreater).toBeTruthy();
        });
    });
});
