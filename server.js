const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = '7402156358:AAGIsNZJiMSPV2y70JefMxireI-iTyyI8w4';
const WEB_APP_URL = 'https://ashatheo.github.io/telegram-clicker-test/';

app.use(bodyParser.json());

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
    setWebhook();
});

// Set webhook for Telegram
const setWebhook = async () => {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=https://ashatheo.github.io/telegram-clicker-test/webhook/${TELEGRAM_BOT_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
};
