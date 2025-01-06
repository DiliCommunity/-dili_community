class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.maxQuantity = 100;
        this.init();
        this.renderCartCount();
    }

    init() {
        // Добавляем обработчики для кнопок "В корзину"
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const productId = card.dataset.productId;
                this.showQuantityDialog(card, productId);
            });
        });

        // Если мы на странице корзины, отображаем товары
        if (window.location.pathname.includes('cart.html')) {
            this.renderCart();
        }
    }

    renderCartCount() {
        const count = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartLink = document.querySelector('a[href="cart.html"]');
        if (cartLink) {
            // Добавляем счетчик товаров рядом с ссылкой на корзину
            if (count > 0) {
                cartLink.setAttribute('data-count', count);
                cartLink.classList.add('has-items');
            } else {
                cartLink.removeAttribute('data-count');
                cartLink.classList.remove('has-items');
            }
        }
    }

    showQuantityDialog(card, productId) {
        // Создаем диалог выбора количества
        const dialog = document.createElement('div');
        dialog.className = 'quantity-dialog';
        
        const product = {
            id: productId,
            name: card.querySelector('h4').textContent,
            price: card.querySelector('p').textContent.replace('Цена: ', ''),
            image: card.querySelector('img').src
        };

        dialog.innerHTML = `
            <div class="quantity-dialog-content">
                <h3>Выберите количество</h3>
                <div class="quantity-controls">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="${this.maxQuantity}">
                    <button class="quantity-btn plus">+</button>
                </div>
                <div class="dialog-buttons">
                    <button class="cancel-btn">Отмена</button>
                    <button class="confirm-btn">Добавить</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        
        const quantityInput = dialog.querySelector('.quantity-input');
        const minusBtn = dialog.querySelector('.minus');
        const plusBtn = dialog.querySelector('.plus');
        const confirmBtn = dialog.querySelector('.confirm-btn');
        const cancelBtn = dialog.querySelector('.cancel-btn');

        // Обработчики для кнопок + и -
        minusBtn.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            if (value < this.maxQuantity) {
                quantityInput.value = value + 1;
            }
        });

        // Валидация ввода
        quantityInput.addEventListener('input', () => {
            let value = parseInt(quantityInput.value);
            if (isNaN(value) || value < 1) {
                quantityInput.value = 1;
            } else if (value > this.maxQuantity) {
                quantityInput.value = this.maxQuantity;
            }
        });

        // Подтверждение
        confirmBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            this.addItem(product, quantity);
            this.showNotification(`Добавлено ${quantity} шт. в корзину`);
            dialog.remove();
        });

        // Отмена
        cancelBtn.addEventListener('click', () => {
            dialog.remove();
        });

        // Анимация появления
        setTimeout(() => dialog.classList.add('show'), 10);
    }

    addItem(product, quantity) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            existingItem.quantity = Math.min(newQuantity, this.maxQuantity);
        } else {
            this.items.push({ ...product, quantity });
        }
        this.saveCart();
        this.renderCartCount();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCartCount();
        this.renderCart();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        // Обновляем счетчик в навигации
        const cartLink = document.querySelector('a[href="cart.html"]');
        if (cartLink) {
            cartLink.setAttribute('data-count', count);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 100);
    }

    renderCart() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
            return;
        }

        let totalPrice = 0;
        const cartHTML = this.items.map(item => {
            const price = parseInt(item.price.replace(/[^\d]/g, ''));
            const itemTotal = price * item.quantity;
            totalPrice += itemTotal;

            return `
                <div class="cart-item" data-product-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="item-price">${item.price}</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn minus">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <p class="item-total">Итого: ${itemTotal} ₽</p>
                    </div>
                    <button class="remove-item">×</button>
                </div>
            `;
        }).join('');

        cartContainer.innerHTML = `
            ${cartHTML}
            <div class="cart-total">
                <h3>Итого к оплате: ${totalPrice} ₽</h3>
                <button class="checkout-btn">Оформить заказ</button>
            </div>
        `;

        this.initCartControls();
    }

    initCartControls() {
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                const productId = cartItem.dataset.productId;
                const item = this.items.find(item => item.id === productId);
                
                if (e.target.classList.contains('plus')) {
                    item.quantity = (item.quantity || 1) + 1;
                } else if (e.target.classList.contains('minus') && item.quantity > 1) {
                    item.quantity--;
                }
                
                this.saveCart();
                this.renderCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                this.removeItem(cartItem.dataset.productId);
            });
        });
    }
}

// Инициализация корзины
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
    if (window.location.pathname.includes('cart.html')) {
        window.cart.renderCart();
    }
}); 