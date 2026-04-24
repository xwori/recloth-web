// ============================================
// SMOOTH SCROLL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll для всех ссылок с якорями
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // if (href === '#') return;

            if (href && href.startsWith('#')) {
                return true; // позволяет браузеру обработать переход
            }

            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerLogo = document.querySelector('.header-logo');
                const navBar = document.querySelector('.nav-bar');
                const headerHeight = headerLogo.offsetHeight + navBar.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню если открыто
                const nav = document.getElementById('nav');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });
});

// ============================================
// MOBILE MENU
// ============================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');

if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // Закрываем меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
}

// ============================================
// LAZY LOAD IMAGES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ============================================
// FADE-IN ANIMATIONS (Intersection Observer)
// ============================================
const fadeElements = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
} else {
    // Fallback для старых браузеров
    fadeElements.forEach(element => {
        element.classList.add('visible');
    });
}

// ============================================
// GALLERY FILTERS
// ============================================
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Убираем active со всех кнопок
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Добавляем active к нажатой кнопке
        this.classList.add('active');
        
        const filter = this.dataset.filter;
        
        galleryItems.forEach(item => {
            if (filter === 'all') {
                item.classList.remove('hidden');
            } else {
                const categories = item.dataset.category.split(' ');
                if (categories.includes(filter)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });
    });
});

// ============================================
// GALLERY MODAL
// ============================================
const galleryModal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalLink = document.querySelector('.modal-link');

// Открытие модального окна при клике на галерею
galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img) {
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Закрытие модального окна
if (modalClose) {
    modalClose.addEventListener('click', function() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Закрытие при клике вне изображения
galleryModal.addEventListener('click', function(e) {
    if (e.target === galleryModal) {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================
const headerLogo = document.querySelector('.header-logo');
const navBar = document.querySelector('.nav-bar');
let lastScroll = 0;

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        if (headerLogo) headerLogo.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.12)';
        if (navBar) navBar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    } else {
        if (headerLogo) headerLogo.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
        if (navBar) navBar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// FORM VALIDATION
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем значения полей
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const photo = document.getElementById('photo').files[0];
        const description = document.getElementById('description').value.trim();
        
        // Валидация
        let isValid = true;
        let errorMessage = '';
        
        if (!name || name.length < 2) {
            isValid = false;
            errorMessage += 'Имя должно содержать минимум 2 символа.\n';
        }
        
        if (!email || !isValidEmail(email)) {
            isValid = false;
            errorMessage += 'Введите корректный email адрес.\n';
        }
        
        if (!photo) {
            isValid = false;
            errorMessage += 'Загрузите фото работы.\n';
        } else {
            // Проверка размера файла (макс 5MB)
            if (photo.size > 5 * 1024 * 1024) {
                isValid = false;
                errorMessage += 'Размер файла не должен превышать 5MB.\n';
            }
            
            // Проверка типа файла
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(photo.type)) {
                isValid = false;
                errorMessage += 'Загрузите изображение в формате JPG, PNG, GIF или WEBP.\n';
            }
        }
        
        if (!description || description.length < 10) {
            isValid = false;
            errorMessage += 'Описание должно содержать минимум 10 символов.\n';
        }
        
        if (!isValid) {
            alert(errorMessage);
            return;
        }
        
        // Если валидация прошла, отправляем форму
        const formData = new FormData(this);
        
        // Показываем индикатор загрузки
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Отправка через Formspree (замените YOUR_FORM_ID на реальный ID)
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Спасибо! Ваша работа отправлена. Мы свяжемся с вами в ближайшее время.');
                this.reset();
            } else {
                throw new Error('Ошибка отправки формы');
            }
        })
        .catch(error => {
            alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
            console.error('Form error:', error);
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// Функция проверки email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// ARTICLES CAROUSEL (опционально, можно добавить автопрокрутку)
// ============================================
// Простая реализация карусели для мобильных устройств
let isDown = false;
let startX;
let scrollLeft;
const articlesGrid = document.getElementById('articlesGrid');

if (articlesGrid && window.innerWidth <= 768) {
    articlesGrid.addEventListener('mousedown', (e) => {
        isDown = true;
        articlesGrid.style.cursor = 'grabbing';
        startX = e.pageX - articlesGrid.offsetLeft;
        scrollLeft = articlesGrid.scrollLeft;
    });
    
    articlesGrid.addEventListener('mouseleave', () => {
        isDown = false;
        articlesGrid.style.cursor = 'grab';
    });
    
    articlesGrid.addEventListener('mouseup', () => {
        isDown = false;
        articlesGrid.style.cursor = 'grab';
    });
    
    articlesGrid.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - articlesGrid.offsetLeft;
        const walk = (x - startX) * 2;
        articlesGrid.scrollLeft = scrollLeft - walk;
    });
}

// ============================================
// PWA SERVICE WORKER REGISTRATION
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// ============================================
// UTILITY: Debounce function
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Оптимизация скролла
const optimizedScroll = debounce(() => {
    // Дополнительные действия при скролле если нужно
}, 10);

window.addEventListener('scroll', optimizedScroll);

// ============================================
// ============== НОВЫЙ КОД: API и загрузка данных из PostgreSQL ==============
// ============================================

// Вспомогательная функция для экранирования HTML (безопасность)
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Функция для повторной инициализации fade-in анимаций (после загрузки новых элементов)
function initFadeObserver() {
    const fadeElements = document.querySelectorAll('.fade-in:not(.visible)');
    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        fadeElements.forEach(element => {
            fadeObserver.observe(element);
        });
    } else {
        fadeElements.forEach(element => {
            element.classList.add('visible');
        });
    }
}

// ========== ЗАГРУЗКА СТАТЕЙ ==========
async function loadArticlesFromDB() {
    try {
        const response = await fetch('/api/articles');
        if (!response.ok) throw new Error('Ошибка загрузки статей');
        const articles = await response.json();
        
        const articlesGrid = document.getElementById('articlesGrid');
        if (!articlesGrid) return;
        
        // Если есть статьи в БД — заменяем статический контент
        if (articles.length > 0) {
            articlesGrid.innerHTML = articles.map(article => `
                <article class="article-card fade-in">
                    <div class="article-image">
                        <img src="${article.featured_image || 'images/default.jpg'}" alt="${escapeHtml(article.title)}" loading="lazy">
                    </div>
                    <div class="article-content">
                        <h3 class="article-title">${escapeHtml(article.title)}</h3>
                        <p class="article-excerpt">${escapeHtml(article.excerpt || '')}</p>
                        <a href="article.html?slug=${article.slug}" class="article-link">Читать полностью →</a>
                    </div>
                </article>
            `).join('');
            
            // Повторно инициализируем lazy loading для новых изображений
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                            }
                            observer.unobserve(img);
                        }
                    });
                });
                document.querySelectorAll('#articlesGrid img[data-src]').forEach(img => imageObserver.observe(img));
            }
            
            initFadeObserver();
        }
    } catch (error) {
        console.error('Ошибка загрузки статей:', error);
        // В случае ошибки оставляем статический контент
    }
}

// ========== ЗАГРУЗКА ИДЕЙ ==========
async function loadIdeasFromDB() {
    try {
        const response = await fetch('/api/ideas');
        if (!response.ok) throw new Error('Ошибка загрузки идей');
        const ideas = await response.json();
        
        const ideasGrid = document.querySelector('.ideas-grid');
        if (!ideasGrid) return;
        
        const difficultyMap = {
            'easy': 'Легко',
            'medium': 'Средне',
            'hard': 'Сложно'
        };
        
        if (ideas.length > 0) {
            ideasGrid.innerHTML = ideas.map(idea => `
                <div class="idea-card fade-in">
                    <div class="idea-images">
                        <div class="idea-before">
                            <img src="${idea.before_image}" alt="До" loading="lazy">
                            <span class="idea-label">ДО</span>
                        </div>
                        <div class="idea-arrow">→</div>
                        <div class="idea-after">
                            <img src="${idea.after_image}" alt="После" loading="lazy">
                            <span class="idea-label">ПОСЛЕ</span>
                        </div>
                    </div>
                    <div class="idea-content">
                        <h3 class="idea-title">${escapeHtml(idea.title)}</h3>
                        <div class="idea-meta">
                            <span class="idea-time">${idea.time_minutes || '?'} мин</span>
                            <span class="idea-difficulty">${difficultyMap[idea.difficulty_level] || idea.difficulty_level}</span>
                        </div>
                        <div class="idea-steps">
                            ${idea.steps?.map(step => `<span>${step.step_number}. ${escapeHtml(step.description)}</span>`).join('') || ''}
                        </div>
                        <p class="idea-materials">Материалы: ${idea.materials?.map(m => m.name).join(', ') || ''}</p>
                        <a href="idea.html?slug=${idea.slug}" class="idea-link">Подробнее в статье</a>
                    </div>
                </div>
            `).join('');
            
            initFadeObserver();
        }
    } catch (error) {
        console.error('Ошибка загрузки идей:', error);
    }
}

// ========== ЗАГРУЗКА ГАЛЕРЕИ ==========
async function loadGalleryFromDB() {
    try {
        const response = await fetch('/api/gallery');
        if (!response.ok) throw new Error('Ошибка загрузки галереи');
        const works = await response.json();
        
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        
        if (works.length > 0) {
            galleryGrid.innerHTML = works.map(work => `
                <div class="gallery-item fade-in" data-category="all ${work.category_slug || ''}">
                    <img src="${work.image_url}" alt="${escapeHtml(work.title || 'Работа пользователя')}" loading="lazy">
                    <div class="gallery-overlay">
                        <button class="gallery-link like-btn" data-id="${work.id}">❤️ ${work.likes_count || 0}</button>
                    </div>
                </div>
            `).join('');
            
            // Пересоздаём обработчики лайков
            document.querySelectorAll('.like-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.id;
                    try {
                        const likeResponse = await fetch(`/api/gallery/${id}/like`, { method: 'POST' });
                        if (likeResponse.ok) {
                            const currentText = btn.textContent;
                            const match = currentText.match(/\d+/);
                            const currentCount = match ? parseInt(match[0]) : 0;
                            btn.textContent = `❤️ ${currentCount + 1}`;
                        }
                    } catch (error) {
                        console.error('Ошибка лайка:', error);
                    }
                });
            });
            
            // Пересоздаём обработчики модального окна
            const newGalleryItems = document.querySelectorAll('.gallery-item');
            const galleryModal = document.getElementById('galleryModal');
            const modalImage = document.getElementById('modalImage');
            
            newGalleryItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    // Не открываем модалку если кликнули на кнопку лайка
                    if (e.target.classList.contains('like-btn')) return;
                    const img = this.querySelector('img');
                    if (img && galleryModal) {
                        modalImage.src = img.src;
                        modalImage.alt = img.alt;
                        galleryModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                });
            });
            
            initFadeObserver();
        }
    } catch (error) {
        console.error('Ошибка загрузки галереи:', error);
    }
}

// ========== ЗАГРУЗКА КАТЕГОРИЙ ДЛЯ ФИЛЬТРОВ ==========
async function loadCategoriesForFilters() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Ошибка загрузки категорий');
        const categories = await response.json();
        
        const filtersContainer = document.querySelector('.gallery-filters');
        if (!filtersContainer) return;
        
        // Сохраняем существующую кнопку "Все" и добавляем категории
        const allButton = '<button class="filter-btn active" data-filter="all">Все</button>';
        const categoryButtons = categories.map(cat => `
            <button class="filter-btn" data-filter="${cat.slug}">${escapeHtml(cat.name)}</button>
        `).join('');
        
        filtersContainer.innerHTML = allButton + categoryButtons;
        
        // Пересоздаём обработчики фильтров
        const newFilterButtons = document.querySelectorAll('.filter-btn');
        const galleryItemsForFilter = document.querySelectorAll('.gallery-item');
        
        newFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                newFilterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                
                galleryItemsForFilter.forEach(item => {
                    if (filter === 'all') {
                        item.classList.remove('hidden');
                    } else {
                        const categories = item.dataset.category ? item.dataset.category.split(' ') : [];
                        if (categories.includes(filter)) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    }
                });
            });
        });
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
    }
}

// ========== ОБНОВЛЁННАЯ ФОРМА ОТПРАВКИ (работает с нашим API) ==========
function initFormSubmit() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Удаляем старый обработчик и добавляем новый
    const newForm = contactForm.cloneNode(true);
    contactForm.parentNode.replaceChild(newForm, contactForm);
    
    newForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const photo = document.getElementById('photo').files[0];
        const description = document.getElementById('description').value.trim();
        
        // Валидация
        let isValid = true;
        let errorMessage = '';
        
        if (!name || name.length < 2) {
            isValid = false;
            errorMessage += 'Имя должно содержать минимум 2 символа.\n';
        }
        
        if (!email || !isValidEmail(email)) {
            isValid = false;
            errorMessage += 'Введите корректный email адрес.\n';
        }
        
        if (!photo) {
            isValid = false;
            errorMessage += 'Загрузите фото работы.\n';
        } else {
            if (photo.size > 5 * 1024 * 1024) {
                isValid = false;
                errorMessage += 'Размер файла не должен превышать 5MB.\n';
            }
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(photo.type)) {
                isValid = false;
                errorMessage += 'Загрузите изображение в формате JPG, PNG, GIF или WEBP.\n';
            }
        }
        
        if (!description || description.length < 10) {
            isValid = false;
            errorMessage += 'Описание должно содержать минимум 10 символов.\n';
        }
        
        if (!isValid) {
            alert(errorMessage);
            return;
        }
        
        // Отправка на наш API
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('description', description);
        formData.append('photo', photo);
        
        const submitBtn = newForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/gallery', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert(result.message || 'Спасибо! Ваша работа отправлена на модерацию.');
                newForm.reset();
            } else {
                throw new Error(result.error || 'Ошибка отправки');
            }
        } catch (error) {
            alert('Произошла ошибка: ' + error.message);
            console.error('Form error:', error);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ========== ЗАПУСК ЗАГРУЗКИ ДАННЫХ ==========
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем данные из базы
    loadArticlesFromDB();
    loadIdeasFromDB();
    loadGalleryFromDB();
    loadCategoriesForFilters();
    initFormSubmit();
});