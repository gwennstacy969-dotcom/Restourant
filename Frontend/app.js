// --- Dark Mode Toggle ---
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Cek preferensi user di localStorage
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️';
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    // Simpan preferensi & ubah ikon
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = '🌙';
    }
});

// --- Command Palette (Ctrl + K) ---
const commandPalette = document.getElementById('command-palette');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

function togglePalette() {
    commandPalette.classList.toggle('hidden');
    if (!commandPalette.classList.contains('hidden')) {
        searchInput.focus();
    }
}

// Buka dengan tombol
searchBtn.addEventListener('click', togglePalette);

// Buka dengan Shortcut Keyboard (Ctrl+K atau Cmd+K)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); // Mencegah browser membuka search default
        togglePalette();
    }

    // Tutup dengan Escape
    if (e.key === 'Escape' && !commandPalette.classList.contains('hidden')) {
        commandPalette.classList.add('hidden');
    }
});

// Tutup jika klik di luar kotak modal
commandPalette.addEventListener('click', (e) => {
    if (e.target === commandPalette) {
        commandPalette.classList.add('hidden');
    }
});