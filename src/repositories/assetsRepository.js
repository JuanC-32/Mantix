const database = require('../config/database');

async function findAll() {
    const [rows] = await database.execute(
        `SELECT id, asset_code, name, description, location, status, created_at, updated_at
         FROM assets
         ORDER BY name ASC, id ASC`
    );

    return rows;
}

module.exports = { findAll };
