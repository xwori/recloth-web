const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Только изображения'));
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Раздаём статические файлы

// Создаём папку для загрузок, если её нет
const fs = require('fs');
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ============= API ENDPOINTS =============

// Получить все статьи
app.get('/api/articles', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, slug, title, excerpt, featured_image, 
                   difficulty_level, reading_time, published_at, 
                   video_url -- Добавили это поле, чтобы оно приходило из базы
            FROM articles 
            WHERE is_published = true 
            ORDER BY published_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка загрузки статей:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить статью по slug
app.get('/api/articles/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await pool.query(`
            SELECT a.*, c.name as category_name, c.slug as category_slug
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.slug = $1 AND a.is_published = true
        `, [slug]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Статья не найдена' });
        }
        
        // Получаем изображения для статьи
        const imagesResult = await pool.query(`
            SELECT image_url, caption, sort_order
            FROM article_images
            WHERE article_id = $1
            ORDER BY sort_order
        `, [result.rows[0].id]);
        
        const article = result.rows[0];
        article.images = imagesResult.rows;
        
        res.json(article);
    } catch (err) {
        console.error('Ошибка загрузки статьи:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить все идеи трансформаций
app.get('/api/ideas', async (req, res) => {
    try {
        const ideasResult = await pool.query(`
            SELECT * FROM ideas 
            WHERE is_active = true 
            ORDER BY created_at DESC
        `);
        
        const ideas = [];
        for (const idea of ideasResult.rows) {
            // Получаем материалы для идеи
            const materialsResult = await pool.query(`
                SELECT m.name, im.quantity
                FROM idea_materials im
                JOIN materials m ON im.material_id = m.id
                WHERE im.idea_id = $1
            `, [idea.id]);
            
            // Получаем шаги для идеи
            const stepsResult = await pool.query(`
                SELECT step_number, description, image_url
                FROM idea_steps
                WHERE idea_id = $1
                ORDER BY step_number
            `, [idea.id]);
            
            ideas.push({
                ...idea,
                materials: materialsResult.rows,
                steps: stepsResult.rows
            });
        }
        
        res.json(ideas);
    } catch (err) {
        console.error('Ошибка загрузки идей:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить галерею работ
app.get('/api/gallery', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT gw.id, gw.title, gw.description, gw.image_url, 
                   gw.likes_count, gw.created_at,
                   u.name as author_name, u.instagram, u.telegram,
                   c.name as category_name, c.slug as category_slug
            FROM gallery_works gw
            LEFT JOIN users u ON gw.user_id = u.id
            LEFT JOIN categories c ON gw.category_id = c.id
            WHERE gw.is_approved = true
            ORDER BY gw.created_at DESC
            LIMIT 50
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка загрузки галереи:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить категории
app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM categories 
            WHERE is_active = true 
            ORDER BY sort_order
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка загрузки категорий:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});


// === ГЛАВНАЯ СТРАНИЦА ===
app.get('/', (req, res) => {
    res.render('index'); // Это заставит сервер показать файл views/index.ejs
});
// Страница выбора всех опросов
app.get('/quizzes', (req, res) => {
    res.render('quizzes');
});

// Страница с конкретной Google Формой
app.get('/quiz-google', (req, res) => {
    res.render('quiz-google');
});

// === ДОБАВЬ ЭТОТ МАРШРУТ ДЛЯ ТЕСТА С КАРТИНКАМИ ===
app.get('/quiz-images', (req, res) => {
    res.render('quiz-images');
});

// Маршрут для страницы статьи
app.get('/article', (req, res) => {
    res.render('article'); // Это заставит сервер искать файл views/article.ejs
});

// Отправить работу в галерею (с загрузкой фото)
app.post('/api/gallery', upload.single('photo'), async (req, res) => {
    try {
        const { name, email, description } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        if (!imageUrl) {
            return res.status(400).json({ error: 'Фото обязательно' });
        }
        
        // Находим или создаём пользователя
        let userResult = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        
        let userId;
        if (userResult.rows.length === 0) {
            const newUser = await pool.query(
                'INSERT INTO users (name, email, is_active) VALUES ($1, $2, true) RETURNING id',
                [name, email]
            );
            userId = newUser.rows[0].id;
        } else {
            userId = userResult.rows[0].id;
        }
        
        // Добавляем работу в галерею (is_approved = false, нужна модерация)
        await pool.query(
            `INSERT INTO gallery_works (user_id, title, description, image_url, is_approved, created_at) 
             VALUES ($1, $2, $3, $4, $5, NOW())`,
            [userId, name, description, imageUrl, false]
        );
        
        res.json({ success: true, message: 'Работа отправлена на модерацию' });
    } catch (err) {
        console.error('Ошибка отправки работы:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Лайк для работы в галерее
app.post('/api/gallery/:id/like', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(
            'UPDATE gallery_works SET likes_count = likes_count + 1 WHERE id = $1',
            [id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Ошибка лайка:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Если кто-то все же перейдет по старой ссылке index.html, 
// сервер просто перенаправит его на главную
app.get('/index.html', (req, res) => {
    res.redirect('/');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});