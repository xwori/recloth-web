const { Pool } = require('pg');
require('dotenv').config();

// Эта строка поможет нам увидеть, загрузилась ли ссылка
if (!process.env.DATABASE_URL) {
    console.error("ОШИБКА: DATABASE_URL не найден в файле .env!");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    // Увеличим время ожидания до 15 секунд
    connectionTimeoutMillis: 15000 
});

module.exports = pool;