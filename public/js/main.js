document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
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
                
                if (response.ok) {
                    // Перенаправление на страницу успешной регистрации
                    window.location.href = '/success.html';
                } else {
                    const messageDiv = document.getElementById('message');
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
                    // Здесь можно добавить перенаправление на защищенную страницу
                    setTimeout(() => {
                        window.location.href = '/dashboard.html';
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
}); 