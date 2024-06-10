const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = '7402156358:AAGIsNZJiMSPV2y70JefMxireI-iTyyI8w4';
const WEB_APP_URL = 'https://ashatheo.github.io/telegram-clicker-test/';

let userData = {}; // Сохранение данных пользователей в памяти

app.use(bodyParser.json());
app.use(express.static('public'));

// Получение данных пользователя
app.post('/getUserData', (req, res) => {
    const userId = req.body.userId;
    if (userData[userId]) {
        res.json(userData[userId]);
    } else {
        res.json({ counter: 0, pointsPerClick: 1, upgradeCost: 10, energyUpgradeCost: 500, currentEnergy: 3000, maxEnergy: 3000 });
    }
});

// Сохранение данных пользователя
app.post('/saveUserData', (req, res) => {
    const userId = req.body.userId;
    userData[userId] = req.body.data;
    res.sendStatus(200);
});

app.post(`/webhook/${TELEGRAM_BOT_TOKEN}`, (req, res) => {
    const message = req.body.message;

    if (!message) {
        return res.sendStatus(400);
    }

    const chatId = message.chat.id;
    const text = message.text;

    if (text === '/start') {
        sendWebApp(chatId, 'Welcome to the Notcoin Clicker Bot! Click the button below to start playing.', WEB_APP_URL);
    } else {
        sendMessage(chatId, `You said: ${text}`);
    }

    res.sendStatus(200);
});

async function sendMessage(chatId, text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: text
        })
    });
}

async function sendWebApp(chatId, text, webAppUrl) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            reply_markup: {
                inline_keyboard: [[{ text: 'Open Web App', web_app: { url: webAppUrl } }]]
            }
        })
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    setWebhook();
});

// Set webhook for Telegram
const setWebhook = async () => {
    const ngrokUrl = 'https://f4ac08d2249b.ngrok.app'; // замените на ваш ngrok URL
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${ngrokUrl}/webhook/${TELEGRAM_BOT_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
};
