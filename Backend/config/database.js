// ==================================
// config/database.js
// Koneksi ke SQL Server Express
// ==================================

const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
    port: parseInt(process.env.DB_PORT) || 1433,
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'CateringDB',
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true,
        instanceName: undefined // Will be parsed from server string
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Parse instance name from server string (e.g., "localhost\SQLEXPRESS")
if (dbConfig.server.includes('\\')) {
    const parts = dbConfig.server.split('\\');
    dbConfig.server = parts[0];
    dbConfig.options.instanceName = parts[1];
    // When using instanceName, port should not be specified
    delete dbConfig.port;
}

let pool = null;

/**
 * Get or create the connection pool
 */
async function getPool() {
    if (pool) {
        return pool;
    }
    try {
        pool = await sql.connect(dbConfig);
        console.log('✅ Terhubung ke SQL Server Express');
        return pool;
    } catch (err) {
        console.error('❌ Gagal terhubung ke SQL Server:', err.message);
        throw err;
    }
}

/**
 * Close the connection pool
 */
async function closePool() {
    if (pool) {
        await pool.close();
        pool = null;
        console.log('🔌 Koneksi SQL Server ditutup');
    }
}

module.exports = { sql, getPool, closePool, dbConfig };
