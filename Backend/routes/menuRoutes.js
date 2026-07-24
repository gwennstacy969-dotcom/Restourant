// ==================================
// routes/menuRoutes.js
// API endpoints untuk Menu & Packages
// ==================================

const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/database');

// GET /api/menu — Ambil semua menu
router.get('/menu', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT * FROM Menu WHERE is_available = 1 ORDER BY category, name
        `);
        res.json({
            success: true,
            data: result.recordset,
            count: result.recordset.length
        });
    } catch (err) {
        console.error('Error fetching menu:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil data menu' });
    }
});

// GET /api/menu/:category — Filter menu by category
router.get('/menu/:category', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('category', sql.NVarChar, req.params.category)
            .query('SELECT * FROM Menu WHERE category = @category AND is_available = 1 ORDER BY name');
        res.json({
            success: true,
            data: result.recordset,
            count: result.recordset.length
        });
    } catch (err) {
        console.error('Error fetching menu by category:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil data menu' });
    }
});

// GET /api/packages — Ambil semua paket nasi box
router.get('/packages', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT * FROM Packages ORDER BY price ASC
        `);

        // Parse JSON items string into array
        const packages = result.recordset.map(pkg => ({
            ...pkg,
            items: JSON.parse(pkg.items || '[]')
        }));

        res.json({
            success: true,
            data: packages,
            count: packages.length
        });
    } catch (err) {
        console.error('Error fetching packages:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil data paket' });
    }
});

// GET /api/packages/:id — Ambil detail satu paket
router.get('/packages/:id', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Packages WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Paket tidak ditemukan' });
        }

        const pkg = result.recordset[0];
        pkg.items = JSON.parse(pkg.items || '[]');

        res.json({ success: true, data: pkg });
    } catch (err) {
        console.error('Error fetching package:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil data paket' });
    }
});

module.exports = router;
