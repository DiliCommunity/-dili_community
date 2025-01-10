document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userData = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            };

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const data = await response.json();
                const messageDiv = document.getElementById('message');

                if (response.ok) {
                    messageDiv.className = 'success';
                    messageDiv.textContent = 'Вход выполнен успешно!';
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    messageDiv.className = 'error';
                    messageDiv.textContent = data.message || 'Ошибка при входе';
                }
            } catch (error) {
                const messageDiv = document.getElementById('message');
                messageDiv.className = 'error';
                messageDiv.textContent = 'Ошибка сервера. Попробуйте позже.';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                birth_date: document.getElementById('birth_date').value
            };

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const data = await response.json();
                const messageDiv = document.getElementById('message');

                if (response.ok) {
                    messageDiv.className = 'success';
                    messageDiv.textContent = 'Регистрация успешна!';
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    messageDiv.className = 'error';
                    messageDiv.textContent = data.message || 'Ошибка при регистрации';
                }
            } catch (error) {
                const messageDiv = document.getElementById('message');
                messageDiv.className = 'error';
                messageDiv.textContent = 'Ошибка сервера. Попробуйте позже.';
            }
        });
    }
});

// Функции для социальных сетей
function loginWithGoogle() {
    alert('Функция входа через Google будет доступна позже');
}

function loginWithTelegram() {
    alert('Функция входа через Telegram будет доступна позже');
} 