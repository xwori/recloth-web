# Инструкция по настройке сайта Recloth

## 🚀 Быстрый старт

1. **Добавьте изображения**
   - Поместите логотип `logo.png` (280x90px) в папку `images/`
   - Добавьте все необходимые изображения согласно `images/README.md`

2. **Настройте форму обратной связи**
   - Зарегистрируйтесь на [Formspree.io](https://formspree.io)
   - Создайте новую форму
   - Скопируйте ваш Form ID
   - В файле `index.html` найдите строку:
     ```html
     <form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
     ```
   - Замените `YOUR_FORM_ID` на ваш реальный ID

3. **Настройте карту (опционально)**
   - В секции контактов можно добавить реальную карту Yandex Maps
   - Замените placeholder на код встраивания карты

4. **Запустите локальный сервер**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

5. **Откройте в браузере**
   - Перейдите на `http://localhost:8000`

## 📝 Дополнительные настройки

### PWA иконки
Создайте иконки для PWA:
- `images/icon-192.png` (192x192px)
- `images/icon-512.png` (512x512px)

Можно использовать онлайн генераторы:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

### Оптимизация изображений
Перед загрузкой оптимизируйте изображения:
- Используйте [TinyPNG](https://tinypng.com/) или [Squoosh](https://squoosh.app/)
- Рекомендуемый формат: WebP с fallback на JPG

### SEO настройки
Проверьте и обновите мета-теги в `<head>`:
- Open Graph теги для социальных сетей
- Twitter Card теги
- Canonical URL

## 🔧 Технические детали

### Структура проекта
- `index.html` - основная HTML структура
- `style.css` - все стили (CSS Grid, Flexbox, анимации)
- `script.js` - JavaScript функциональность
- `manifest.json` - PWA манифест
- `sw.js` - Service Worker для офлайн работы

### Браузерная поддержка
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Мобильные браузеры (iOS Safari 14+, Chrome Mobile)

### Производительность
- Lazy loading изображений
- Оптимизированные анимации через Intersection Observer
- Кеширование через Service Worker
- Минификация CSS/JS для продакшена (рекомендуется)

## 📞 Поддержка

Если возникли вопросы:
- Проверьте консоль браузера на наличие ошибок
- Убедитесь, что все пути к файлам корректны
- Проверьте, что сервер запущен (для PWA требуется HTTPS или localhost)


