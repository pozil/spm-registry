const compression = require('compression'),
    helmet = require('helmet'),
    express = require('express'),
    path = require('path'),
    PackageRestResource = require('./package/packageRestResource'),
    Configuration = require('./utils/configuration.js');
const { Pool } = require('pg');

// Load and check config
require('dotenv').config();
if (!Configuration.isValid()) {
    console.error(
        'Cannot start app: missing mandatory configuration. Check your .env file.'
    );
    process.exit(-1);
}

// Create DB connection pool
const pool = new Pool(Configuration.getDatabaseConfig());

// Configure server
const DIST_DIR = path.join(__dirname, '../../dist');
const app = express();
app.use(helmet());
app.use(compression());
app.use(express.static(DIST_DIR));

// Add REST resources
const packageRest = new PackageRestResource(pool);
app.get('/api/v1/search', (req, res) => {
    packageRest.search(req, res);
});
app.get('/api/v1/package-definition/:definitionId', (req, res) => {
    packageRest.getPackageDefinition(req, res);
});
app.get('/api/v1/package-version', (req, res) => {
    packageRest.getPackageVersion(req, res);
});
app.post('/api/v1/package-version/:versionId', (req, res) => {
    packageRest.publishPackageVersion(req, res);
});

// Start server
const PORT = process.env.PORT || process.env.API_PORT || 3002;
app.listen(PORT, () =>
    console.log(`✅  API Server started: http://localhost:${PORT}`)
);
