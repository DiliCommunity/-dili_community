const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Настройка подключения к базе данных
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Проверка подключения к базе данных
connection.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Успешное подключение к базе данных');
});

// Маршрут для регистрации
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Проверка существования пользователя
        connection.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email],
            async (err, results) => {
                if (err) {
                    console.error('Ошибка при проверке пользователя:', err);
                    return res.status(500).json({ message: 'Ошибка сервера' });
                }

                if (results.length > 0) {
                    return res.status(400).json({ 
                        message: 'Пользователь с таким именем или email уже существует' 
                    });
                }

                // Хеширование пароля
                const hashedPassword = await bcrypt.hash(password, 10);

                // Вставка нового пользователя
                connection.query(
                    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                    [username, email, hashedPassword],
                    (err, results) => {
                        if (err) {
                            console.error('Ошибка при добавлении пользователя:', err);
                            return res.status(500).json({ message: 'Ошибка сервера' });
                        }
                        res.status(201).json({ 
                            message: 'Пользователь успешно зарегистрирован',
                            userId: results.insertId
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для входа
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Поиск пользователя в базе данных
    connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) {
                console.error('Ошибка при поиске пользователя:', err);
                return res.status(500).json({ message: 'Ошибка сервера' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
            }

            const user = results[0];

            // Проверка пароля
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
            }

            res.status(200).json({ message: 'Вход выполнен успешно' });
        }
    );
});

// Базовый маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
    // Здесь можно добавить проверку авторизации
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/catalog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'catalog.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
}); 