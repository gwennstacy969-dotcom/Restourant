// ==================================
// routes/testimonialRoutes.js
// API endpoints untuk Testimonials
// ==================================

const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/database');

// GET /api/testimonials — Ambil semua testimonial
router.get('/testimonials', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT * FROM Testimonials ORDER BY created_at DESC
        `);
        res.json({
            success: true,
            data: result.recordset,
            count: result.recordset.length
        });
    } catch (err) {
        console.error('Error fetching testimonials:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil data testimonial' });
    }
});

// POST /api/testimonials — Tambah testimonial baru
router.post('/testimonials', async (req, res) => {
    try {
        const { name, role, message, rating } = req.body;

        if (!name || !message) {
            return res.status(400).json({
                success: false,
                message: 'Nama dan pesan wajib diisi'
            });
        }

        // Validasi rating
        const validRating = Math.min(5, Math.max(1, parseInt(rating) || 5));

        const pool = await getPool();
        const result = await pool.request()
            .input('name', sql.NVarChar(100), name)
            .input('role', sql.NVarChar(100), role || null)
            .input('message', sql.NVarChar(500), message)
            .input('rating', sql.Int, validRating)
            .query(`
                INSERT INTO Testimonials (name, role, message, rating)
                OUTPUT INSERTED.*
                VALUES (@name, @role, @message, @rating)
            `);

        res.status(201).json({
            success: true,
            message: 'Testimonial berhasil ditambahkan!',
            data: result.recordset[0]
        });
    } catch (err) {
        console.error('Error creating testimonial:', err);
        res.status(500).json({ success: false, message: 'Gagal menambah testimonial' });
    }
});

module.exports = router;
