module.exports = class Configuration {
    static isValid() {
        return (
            process.env.DATABASE_URL !== undefined &&
            process.env.SF_LOGIN_URL !== undefined &&
            process.env.SF_USERNAME !== undefined &&
            process.env.SF_PASSWORD !== undefined
        );
    }

    static getDatabaseConfig() {
        // Get DB configuration
        const dbConfig = {
            connectionString: process.env.DATABASE_URL,
            // Max wait time for acquiring connection
            connectionTimeoutMillis: process.env.DATABASE_CONNECTION_TIMEOUT
                ? parseInt(process.env.DATABASE_CONNECTION_TIMEOUT, 10)
                : 10000,
            // Max pool clients
            max: process.env.DATABASE_MAX_POOL_CLIENT
                ? parseInt(process.env.DATABASE_MAX_POOL_CLIENT, 10)
                : 10
        };
        // Optionnaly require SSL for DB connection
        if (
            process.env.DATABASE_REQUIRES_SSL === undefined ||
            process.env.DATABASE_REQUIRES_SSL.toLocaleLowerCase() === 'true'
        ) {
            dbConfig.ssl = {
                rejectUnauthorized: false // Allow self-signed SSL cert from Heroku
            };
        }
        return dbConfig;
    }

    static getSfLoginUrl() {
        return process.env.SF_LOGIN_URL;
    }

    static getSfUsername() {
        return process.env.SF_USERNAME;
    }

    static getSfPassword() {
        return process.env.SF_PASSWORD;
    }
};
