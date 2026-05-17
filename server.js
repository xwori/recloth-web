const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const pool = require('./db');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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



// Если кто-то все же перейдет по старой ссылке index.html, 
// сервер просто перенаправит его на главную
app.get('/index.html', (req, res) => {
    res.redirect('/');
});


// === ДОБАВЬ ЭТО В РАЗДЕЛ С API МАРШРУТАМИ ===
// Инициализация ИИ
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Страница для нашего ИИ-советника
app.get('/ai-advisor', (req, res) => {
    res.render('ai-advisor'); // Создадим этот файл на следующем шаге
});

// API для текстового чата и фото ИИ
app.post('/api/analyze-photo', upload.single('photo'), async (req, res) => {
    try {
        const userText = req.body.question || "Предложи 3 креативные идеи, как переделать эту вещь, чтобы дать ей вторую жизнь.";
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Ты — профессиональный эко-стилист и эксперт по апсайклингу. Запрос пользователя: "${userText}". 
			Твоя задача — давать советы ИСКЛЮЧИТЕЛЬНО по переделке одежды, тканей, обуви и апсайклингу. 
			ВАЖНОЕ ПРАВИЛО: Если запрос или фотография вообще никак не связаны с одеждой, тканями, модой или апсайклингом, ты должен вежливо ответить: "Извините, но я специализируюсь только на апсайклинге и переделке старых вещей. В других вопросах я плохо разбираюсь."
			Если тема подходит, дай конкретные, креативные и стильные советы. Пиши на русском языке, доброжелательно и структурированно.`;

        let result;

        if (req.file) {
            // Если пользователь загрузил фото
            function fileToGenerativePart(filePath, mimeType) {
                return {
                    inlineData: {
                        data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
                        mimeType
                    },
                };
            }
            const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);
            result = await model.generateContent([prompt, imagePart]);
            
            // Удаляем фотку после анализа
            fs.unlinkSync(req.file.path);
        } else {
            // Если пользователь написал только текст
            result = await model.generateContent(prompt);
        }

        const responseText = result.response.text();
        res.json({ advice: responseText });

    } catch (err) {
        console.error('Ошибка ИИ:', err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        // ТЕПЕРЬ ОШИБКА БУДЕТ ВЫВОДИТЬСЯ НА ЭКРАН
        res.status(500).json({ error: 'Ошибка API: ' + err.message }); 
    }
});


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});