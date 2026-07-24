// ==================================
// scripts/initDB.js
// Auto-create Database, Tables, & Seed Data
// ==================================

const sql = require('mssql');
require('dotenv').config();

const masterConfig = {
    server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    database: 'master',
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true
    }
};

// Parse instance name
if (masterConfig.server.includes('\\')) {
    const parts = masterConfig.server.split('\\');
    masterConfig.server = parts[0];
    masterConfig.options.instanceName = parts[1];
}

const DB_NAME = process.env.DB_NAME || 'CateringDB';

async function initDatabase() {
    let pool;

    try {
        // =============================================
        // STEP 1: Connect to master & create database
        // =============================================
        console.log('🔄 Menghubungkan ke SQL Server...');
        pool = await sql.connect(masterConfig);
        console.log('✅ Terhubung ke SQL Server');

        console.log(`🔄 Membuat database "${DB_NAME}" jika belum ada...`);
        await pool.request().query(`
            IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${DB_NAME}')
            BEGIN
                CREATE DATABASE [${DB_NAME}]
            END
        `);
        console.log(`✅ Database "${DB_NAME}" siap`);

        await pool.close();

        // =============================================
        // STEP 2: Connect to CateringDB & create tables
        // =============================================
        const dbConfig = { ...masterConfig, database: DB_NAME };
        pool = await sql.connect(dbConfig);

        console.log('🔄 Membuat tabel-tabel...');

        // Table: Menu
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Menu' AND xtype='U')
            CREATE TABLE Menu (
                id INT PRIMARY KEY IDENTITY(1,1),
                name NVARCHAR(100) NOT NULL,
                description NVARCHAR(500),
                category NVARCHAR(50),
                price DECIMAL(10,2),
                emoji NVARCHAR(10),
                is_available BIT DEFAULT 1,
                created_at DATETIME DEFAULT GETDATE()
            )
        `);
        console.log('  ✅ Tabel Menu');

        // Table: Packages
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Packages' AND xtype='U')
            CREATE TABLE Packages (
                id INT PRIMARY KEY IDENTITY(1,1),
                name NVARCHAR(100) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                description NVARCHAR(500),
                items NVARCHAR(MAX),
                is_popular BIT DEFAULT 0,
                badge NVARCHAR(50),
                tier NVARCHAR(20)
            )
        `);
        console.log('  ✅ Tabel Packages');

        // Table: Orders
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Orders' AND xtype='U')
            CREATE TABLE Orders (
                id INT PRIMARY KEY IDENTITY(1,1),
                customer_name NVARCHAR(100) NOT NULL,
                customer_phone NVARCHAR(20) NOT NULL,
                customer_email NVARCHAR(100),
                order_type NVARCHAR(20),
                package_id INT,
                quantity INT DEFAULT 1,
                event_date DATE,
                delivery_address NVARCHAR(500),
                notes NVARCHAR(500),
                total_price DECIMAL(10,2),
                status NVARCHAR(20) DEFAULT 'pending',
                created_at DATETIME DEFAULT GETDATE(),
                CONSTRAINT FK_Orders_Packages FOREIGN KEY (package_id) REFERENCES Packages(id)
            )
        `);
        console.log('  ✅ Tabel Orders');

        // Table: Testimonials
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Testimonials' AND xtype='U')
            CREATE TABLE Testimonials (
                id INT PRIMARY KEY IDENTITY(1,1),
                name NVARCHAR(100) NOT NULL,
                role NVARCHAR(100),
                message NVARCHAR(500) NOT NULL,
                rating INT DEFAULT 5,
                created_at DATETIME DEFAULT GETDATE()
            )
        `);
        console.log('  ✅ Tabel Testimonials');

        // =============================================
        // STEP 3: Seed Data
        // =============================================
        console.log('🔄 Mengisi data awal...');

        // Check if data already exists
        const menuCount = await pool.request().query('SELECT COUNT(*) as count FROM Menu');
        if (menuCount.recordset[0].count === 0) {

            // Seed Menu
            await pool.request().query(`
                INSERT INTO Menu (name, description, category, price, emoji) VALUES
                (N'Nasi Bakar Ayam Suwir Kemangi', N'Nasi bakar dengan isi ayam suwir bumbu kemangi yang harum', N'nasi_bakar', 8000, N'🍙'),
                (N'Nasi Bakar Teri Medan', N'Nasi bakar dengan isi teri medan pedas gurih', N'nasi_bakar', 7000, N'🍙'),
                (N'Nasi Bakar Cumi Asin', N'Nasi bakar dengan isi cumi asin sambal matah', N'nasi_bakar', 9000, N'🍙'),
                (N'Nasi Bakar Ati Ampela', N'Nasi bakar dengan isi ati ampela bumbu kuning', N'nasi_bakar', 7500, N'🍙'),
                (N'Sate Usus', N'Sate usus ayam bumbu kacang', N'sate', 2000, N'🍢'),
                (N'Sate Telur Puyuh', N'Telur puyuh tusuk dengan saus kacang', N'sate', 2000, N'🍢'),
                (N'Sate Kulit', N'Kulit ayam crispy tusuk', N'sate', 2000, N'🍢'),
                (N'Sate Ati Ampela', N'Ati ampela ayam bakar bumbu manis', N'sate', 2500, N'🍢'),
                (N'Sate Bakso', N'Bakso tusuk bakar saus pedas', N'sate', 2000, N'🍢'),
                (N'Mendoan', N'Tempe mendoan tipis renyah', N'gorengan', 1500, N'🥟'),
                (N'Tahu Isi Sayur', N'Tahu goreng isi sayuran segar', N'gorengan', 1500, N'🥟'),
                (N'Bakwan Jagung', N'Bakwan jagung manis crispy', N'gorengan', 1500, N'🥟'),
                (N'Pisang Goreng', N'Pisang goreng kipas renyah', N'gorengan', 2000, N'🥟'),
                (N'Wedang Jahe', N'Jahe hangat manis', N'wedangan', 5000, N'☕'),
                (N'Susu Jahe', N'Susu hangat dengan jahe segar', N'wedangan', 7000, N'☕'),
                (N'Teh Kampul', N'Teh manis khas angkringan', N'wedangan', 3000, N'☕'),
                (N'Es Jeruk Peras', N'Jeruk peras segar dingin', N'wedangan', 5000, N'☕')
            `);
            console.log('  ✅ Data Menu (17 items)');

            // Seed Packages
            await pool.request().query(`
                INSERT INTO Packages (name, price, description, items, is_popular, badge, tier) VALUES
                (N'Paket Hemat', 10000, N'Pilihan hemat untuk acara besar',
                 N'["Nasi Putih","Ayam Goreng / Bakar (Potongan Kecil)","Tahu / Tempe Goreng","Sambal & Lalapan"]',
                 0, NULL, N'hemat'),
                (N'Paket Standar', 15000, N'Paket lengkap dengan porsi standar',
                 N'["Nasi Putih","Ayam Goreng / Bakar (Standar)","Tahu & Tempe Goreng","Sayur Asem / Sop","Sambal & Lalapan"]',
                 0, NULL, N'standar'),
                (N'Paket Spesial', 20000, N'Paket terlaris dengan menu spesial',
                 N'["Nasi Putih","Ayam Bakar / Rendang Daging","Telur Balado / Dadar","Sayur / Tumisan","Kerupuk & Buah","Sambal & Lalapan"]',
                 1, N'Terlaris', N'spesial'),
                (N'Paket Premium', 25000, N'Paket premium untuk acara spesial',
                 N'["Nasi Putih / Nasi Kuning","Rendang / Ayam Kampung","Udang Goreng / Telur Balado","Capcay / Tumisan Spesial","Kerupuk Udang & Buah","Sambal, Lalapan & Air Mineral"]',
                 0, N'Premium', N'premium')
            `);
            console.log('  ✅ Data Packages (4 paket)');

            // Seed Testimonials
            await pool.request().query(`
                INSERT INTO Testimonials (name, role, message, rating) VALUES
                (N'Ibu Sari Dewi', N'Pelanggan Langganan', N'Sudah 6 bulan langganan nasi bakar, rasanya konsisten enak dan harganya sangat terjangkau! Anak-anak juga suka.', 5),
                (N'Bapak Andi Wijaya', N'Event Organizer', N'Paket nasi box untuk acara kantor selalu memuaskan. Packing rapi, rasa juara, dan pengiriman tepat waktu.', 5),
                (N'Mbak Rina', N'Pelanggan Reguler', N'Gorengan dan sate-sateannya bikin nagih! Cocok buat teman nongkrong malam. Wedang jahenya juga mantap.', 4),
                (N'Pak Bambang', N'Catering Pernikahan', N'Sudah 3x pesan untuk acara hajatan, 500 box tidak ada yang komplain. Harga bersahabat, rasa premium!', 5),
                (N'Dina Maharani', N'Food Blogger', N'Nasi bakar cumi asinnya juara sih! Bumbu meresap sempurna. Recommended banget untuk yang suka pedas.', 5),
                (N'Hendra Santoso', N'Pelanggan Kantor', N'Catering harian kantor kami pakai Catering 2W. 30 porsi setiap hari, tidak pernah mengecewakan.', 4)
            `);
            console.log('  ✅ Data Testimonials (6 reviews)');

        } else {
            console.log('  ℹ️  Data sudah ada, skip seeding');
        }

        console.log('\n🎉 Inisialisasi database selesai!');
        console.log(`   Database: ${DB_NAME}`);
        console.log('   Tabel: Menu, Packages, Orders, Testimonials');
        console.log('\n   Jalankan "npm start" untuk memulai server.\n');

    } catch (err) {
        console.error('\n❌ Error saat inisialisasi database:', err.message);
        console.error('\nPastikan:');
        console.error('  1. SQL Server Express sudah running');
        console.error('  2. Konfigurasi .env sudah benar');
        console.error('  3. User dan password SQL Server valid\n');
        process.exit(1);
    } finally {
        if (pool) {
            await pool.close();
        }
        process.exit(0);
    }
}

initDatabase();
