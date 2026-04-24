# Recloth — Платформа о переработке и обновлении старой одежды

Одностраничный сайт для сообщества Recloth, посвященного апсайклингу и переработке одежды.

## 🎨 Особенности

- **Современный дизайн** с использованием цветовой палитры из логотипа
- **Полностью responsive** - работает на всех устройствах от 320px до 1920px+
- **PWA поддержка** - можно установить как приложение
- **Оптимизированная производительность** - lazy loading, анимации через Intersection Observer
- **Без фреймворков** - чистый HTML5, CSS3 и Vanilla JavaScript

## 📁 Структура проекта

```
recloth-site/
├── index.html          # Основная HTML структура
├── style.css           # Все стили и responsive дизайн
├── script.js           # JavaScript функциональность
├── manifest.json       # PWA манифест
├── sw.js              # Service Worker для PWA
├── images/            # Папка с изображениями
│   ├── logo.png       # Логотип (280x90px)
│   ├── hero-bg.jpg    # Фон Hero секции
│   ├── articles/      # Изображения для статей
│   ├── ideas/         # Изображения ДО/ПОСЛЕ для идей
│   └── gallery/       # Галерея работ пользователей
└── README.md          # Этот файл
```

## 🚀 Установка и запуск

1. Клонируйте репозиторий или скачайте файлы
2. Добавьте изображения в папку `images/` (см. `images/README.md`)
3. Откройте `index.html` в браузере или используйте локальный сервер:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

4. Откройте в браузере: `http://localhost:8000`

## ⚙️ Настройка

### Formspree для формы
В файле `index.html` найдите форму и замените `YOUR_FORM_ID` на ваш реальный Formspree ID:

```html
<form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Yandex Maps
В секции контактов можно добавить реальную карту Yandex Maps, заменив placeholder.

## 🎯 Основные функции

- ✅ Smooth scroll навигация
- ✅ Мобильное меню
- ✅ Lazy loading изображений
- ✅ Fade-in анимации при скролле
- ✅ Галерея с модальным окном
- ✅ Фильтры галереи
- ✅ Валидация формы
- ✅ PWA поддержка

## 📱 Поддерживаемые браузеры

- Chrome (последние версии)
- Firefox (последние версии)
- Safari (последние версии)
- Edge (последние версии)
- Мобильные браузеры (iOS Safari, Chrome Mobile)

## 🔧 Технологии

- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- Service Worker API
- Intersection Observer API

## 📝 Лицензия

Проект создан для Recloth.

## 📞 Контакты

- Telegram канал: [t.me/upcycling_recloth](https://t.me/upcycling_recloth)
- AI-бот: [@TexelReclothBot](https://t.me/TexelReclothBot)
- Email: hello@recloth.ru


