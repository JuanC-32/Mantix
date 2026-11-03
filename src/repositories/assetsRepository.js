const database = require('../config/database');

async function findAll() {
    const [rows] = await database.execute(
        `SELECT id, asset_code, name, description, location, status, created_at, updated_at
         FROM assets
         ORDER BY name ASC, id ASC`
    );

    return rows;
}

async function create(asset) {
    const [result] = await database.execute(
        `INSERT INTO assets (asset_code, name, description, location)
         VALUES (?, ?, ?, ?)`,
        [asset.asset_code, asset.name, asset.description, asset.location]
    );

    return result.insertId;
}

async function findById(id) {
    const [rows] = await database.execute(
        `SELECT id, asset_code, name, description, location, status, created_at, updated_at
         FROM assets
         WHERE id = ?`,
        [id]
    );

    return rows[0] ?? null;
}

module.exports = { findAll, create, findById };
