// ==================================
// routes/orderRoutes.js
// API endpoints untuk Orders
// ==================================

const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/database');

// POST /api/orders — Buat pesanan baru
router.post('/orders', async (req, res) => {
    try {
        const {
            customer_name,
            customer_phone,
            customer_email,
            order_type,
            package_id,
            quantity,
            event_date,
            delivery_address,
            notes,
            total_price
        } = req.body;

        // Validasi field wajib
        if (!customer_name || !customer_phone) {
            return res.status(400).json({
                success: false,
                message: 'Nama dan nomor telepon wajib diisi'
            });
        }

        const pool = await getPool();
        const result = await pool.request()
            .input('customer_name', sql.NVarChar(100), customer_name)
            .input('customer_phone', sql.NVarChar(20), customer_phone)
            .input('customer_email', sql.NVarChar(100), customer_email || null)
            .input('order_type', sql.NVarChar(20), order_type || 'nasi_box')
            .input('package_id', sql.Int, package_id || null)
            .input('quantity', sql.Int, quantity || 1)
            .input('event_date', sql.Date, event_date || null)
            .input('delivery_address', sql.NVarChar(500), delivery_address || null)
            .input('notes', sql.NVarChar(500), notes || null)
            .input('total_price', sql.Decimal(10, 2), total_price || 0)
            .query(`
                INSERT INTO Orders (
                    customer_name, customer_phone, customer_email, order_type,
                    package_id, quantity, event_date, delivery_address, notes, total_price
                )
                OUTPUT INSERTED.*
                VALUES (
                    @customer_name, @customer_phone, @customer_email, @order_type,
                    @package_id, @quantity, @event_date, @delivery_address, @notes, @total_price
                )
            `);

        res.status(201).json({
            success: true,
            message: 'Pesanan berhasil dibuat!',
            data: result.recordset[0]
        });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ success: false, message: 'Gagal membuat pesanan' });
    }
});

// GET /api/orders — List semua pesanan (admin)
router.get('/orders', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT o.*, p.name as package_name
            FROM Orders o
            LEFT JOIN Packages p ON o.package_id = p.id
            ORDER BY o.created_at DESC
        `);
        res.json({
            success: true,
            data: result.recordset,
            count: result.recordset.length
        });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pesanan' });
    }
});

// GET /api/orders/:id — Detail pesanan
router.get('/orders/:id', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`
                SELECT o.*, p.name as package_name, p.items as package_items
                FROM Orders o
                LEFT JOIN Packages p ON o.package_id = p.id
                WHERE o.id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
        }

        res.json({ success: true, data: result.recordset[0] });
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pesanan' });
    }
});

// PUT /api/orders/:id/status — Update status pesanan
router.put('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status harus salah satu dari: ${validStatuses.join(', ')}`
            });
        }

        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('status', sql.NVarChar(20), status)
            .query(`
                UPDATE Orders SET status = @status
                OUTPUT INSERTED.*
                WHERE id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
        }

        res.json({
            success: true,
            message: `Status pesanan diubah ke "${status}"`,
            data: result.recordset[0]
        });
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ success: false, message: 'Gagal update status pesanan' });
    }
});

module.exports = router;
