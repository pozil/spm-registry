const Configuration = require('../configuration');

const MOCK_DB_URL = 'mockUrl';
const MOCK_SF_LOGIN_URL = 'mockSfLoginUrl';
const MOCK_SF_USERNAME = 'mockSfUsername';
const MOCK_SF_PASSWORD = 'mockSfPassword';

const MOCK_DB_CONFIG_CUSTOM = {
    connectionString: MOCK_DB_URL,
    connectionTimeoutMillis: 1,
    max: 2
};
const MOCK_DB_CONFIG_DEFAULT = {
    connectionString: MOCK_DB_URL,
    connectionTimeoutMillis: 10000,
    max: 10,
    ssl: {
        rejectUnauthorized: false
    }
};

describe('configuration', () => {
    describe('isValid', () => {
        it('returns false when missing config', () => {
            process.env.SF_PASSWORD = undefined;
            expect(Configuration.isValid()).toBeFalsy();
        });

        it('returns true when config is valid', () => {
            process.env.DATABASE_URL = 'a';
            process.env.SF_LOGIN_URL = 'b';
            process.env.SF_USERNAME = 'c';
            process.env.SF_PASSWORD = 'd';
            expect(Configuration.isValid()).toBeTruthy();
        });
    });

    describe('getDatabaseConfig', () => {
        it('works with defaults settings', () => {
            process.env.DATABASE_URL = MOCK_DB_URL;

            const dbConfig = Configuration.getDatabaseConfig();

            expect(dbConfig).toEqual(MOCK_DB_CONFIG_DEFAULT);
        });

        it('works with custom settings', () => {
            process.env.DATABASE_URL = MOCK_DB_URL;
            process.env.DATABASE_CONNECTION_TIMEOUT = 1;
            process.env.DATABASE_MAX_POOL_CLIENT = 2;
            process.env.DATABASE_REQUIRES_SSL = 'false';

            const dbConfig = Configuration.getDatabaseConfig();

            expect(dbConfig).toEqual(MOCK_DB_CONFIG_CUSTOM);
        });
    });

    it('returns the right Salesforce config variables', () => {
        process.env.SF_LOGIN_URL = MOCK_SF_LOGIN_URL;
        process.env.SF_USERNAME = MOCK_SF_USERNAME;
        process.env.SF_PASSWORD = MOCK_SF_PASSWORD;

        expect(Configuration.getSfLoginUrl()).toEqual(MOCK_SF_LOGIN_URL);
        expect(Configuration.getSfUsername()).toEqual(MOCK_SF_USERNAME);
        expect(Configuration.getSfPassword()).toEqual(MOCK_SF_PASSWORD);
    });
});
