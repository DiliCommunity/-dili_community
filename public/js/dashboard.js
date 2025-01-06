document.addEventListener('DOMContentLoaded', () => {
    // Обработчик для кнопки выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                window.location.href = '/login.html';
            } catch (error) {
                console.error('Ошибка при выходе:', error);
            }
        });
    }

    // Обработчик для ссылок навигации
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Убираем класс active у всех ссылок
            navLinks.forEach(l => l.classList.remove('active'));
            // Добавляем класс active к нажатой ссылке
            link.classList.add('active');
        });
    });

    // Обновляем функционал слайдера
    const track = document.querySelector('.products-track');
    const leftBtn = document.querySelector('.scroll-left');
    const rightBtn = document.querySelector('.scroll-right');
    const cards = document.querySelectorAll('.product-card');
    let currentIndex = 0;

    function updateSlider() {
        // Обновляем позицию слайдера
        track.style.transform = `translateX(-${currentIndex * 320}px)`; // 300px ширина + 20px отступ
        
        // Обновляем состояние кнопок
        leftBtn.disabled = currentIndex === 0;
        rightBtn.disabled = currentIndex === cards.length - 1;
        
        // Обновляем видимость карточек
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add('active');
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.classList.remove('active');
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
            }
        });
    }

    leftBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    rightBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    // Инициализация слайдера
    updateSlider();

    // Показываем первую карточку при загрузке
    if (cards.length > 0) {
        cards[0].classList.add('active');
        cards[0].style.opacity = '1';
        cards[0].style.transform = 'scale(1)';
    }
}); 