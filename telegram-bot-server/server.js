const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const WEB_APP_URL = 'https://YOUR_GITHUB_USERNAME.github.io/telegram-clicker-game/';

app.use(bodyParser.json());

app.post(`/webhook/${TELEGRAM_BOT_TOKEN}`, (req, res) => {
    const chatId = req.body.message.chat.id;
    const message = req.body.message.text;

    if (message === '/start') {
        sendWebApp(chatId, 'Welcome to the Notcoin Clicker Bot! Click the button below to start playing.', WEB_APP_URL);
    } else {
        sendMessage(chatId, `You said: ${message}`);
    }

    res.sendStatus(200);
});

function sendMessage(chatId, text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    fetch(url, {
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

function sendWebApp(chatId, text, webAppUrl) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    fetch(url, {
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
});

// Set webhook for Telegram
const setWebhook = async () => {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=https://your-server-domain/webhook/${TELEGRAM_BOT_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
};

setWebhook();
