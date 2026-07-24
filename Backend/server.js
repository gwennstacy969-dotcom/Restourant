// ==================================
// server.js
// Express API Server — Catering 2W
// ==================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { getPool, closePool } = require('./config/database');

// Import Routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================================
// Middleware
// ==================================
app.use(cors({
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString('id-ID');
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// ==================================
// Routes
// ==================================
app.use('/api', menuRoutes);
app.use('/api', orderRoutes);
app.use('/api', testimonialRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Catering 2W API is running 🍽️',
        timestamp: new Date().toISOString()
    });
});

// API info endpoint
app.get('/api', (req, res) => {
    res.json({
        name: 'Catering 2W API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/health',
            menu: 'GET /api/menu',
            menuByCategory: 'GET /api/menu/:category',
            packages: 'GET /api/packages',
            packageById: 'GET /api/packages/:id',
            createOrder: 'POST /api/orders',
            listOrders: 'GET /api/orders',
            orderById: 'GET /api/orders/:id',
            updateOrderStatus: 'PUT /api/orders/:id/status',
            testimonials: 'GET /api/testimonials',
            createTestimonial: 'POST /api/testimonials'
        }
    });
});

// ==================================
// 404 Handler
// ==================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} tidak ditemukan`
    });
});

// ==================================
// Error Handler
// ==================================
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==================================
// Start Server
// ==================================
async function startServer() {
    try {
        // Test database connection
        await getPool();
        console.log('');

        app.listen(PORT, () => {
            console.log('╔═══════════════════════════════════════╗');
            console.log('║     🍽️  Catering 2W API Server       ║');
            console.log('╠═══════════════════════════════════════╣');
            console.log(`║  Server  : http://localhost:${PORT}      ║`);
            console.log(`║  API     : http://localhost:${PORT}/api  ║`);
            console.log('║  Status  : Running ✅                 ║');
            console.log('╚═══════════════════════════════════════╝');
            console.log('');
        });
    } catch (err) {
        console.error('❌ Gagal memulai server:', err.message);
        console.error('   Pastikan SQL Server Express sudah running!');
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    await closePool();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closePool();
    process.exit(0);
});

startServer();
