from flask import Flask, request, jsonify
from aiogram import Bot, Dispatcher, types
from aiogram.utils.executor import start_webhook
import hashlib
import hmac
import time

API_TOKEN = '7402156358:AAGIsNZJiMSPV2y70JefMxireI-iTyyI8w4'
WEB_APP_URL = 'https://ashatheo.github.io/telegram-clicker-test/'

WEBHOOK_HOST = ' https://d7121490c613.ngrok.app'  # Замените на ваш ngrok URL
WEBHOOK_PATH = f'/webhook/{API_TOKEN}'
WEBHOOK_URL = f"{WEBHOOK_HOST}{WEBHOOK_PATH}"

app = Flask(__name__)
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

userData = {}

SECRET_KEY = hashlib.sha256(API_TOKEN.encode()).digest()

@app.route('/getUserData', methods=['POST'])
def get_user_data():
    user_id = request.json.get('userId')
    if user_id in userData:
        return jsonify(userData[user_id])
    else:
        return jsonify({
            "counter": 0,
            "pointsPerClick": 1,
            "upgradeCost": 10,
            "energyUpgradeCost": 500,
            "currentEnergy": 3000,
            "maxEnergy": 3000
        })

@app.route('/saveUserData', methods=['POST'])
def save_user_data():
    user_id = request.json.get('userId')
    data = request.json.get('data')
    userData[user_id] = data
    return '', 200

@app.route('/auth', methods=['POST'])
def auth():
    user = request.json
    data_check_string = '\n'.join([f"{k}={v}" for k, v in sorted(user.items()) if k != 'hash'])
    hash_string = hmac.new(SECRET_KEY, data_check_string.encode(), hashlib.sha256).hexdigest()
    
    if hash_string == user.get('hash'):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})

@app.route(WEBHOOK_PATH, methods=['POST'])
def webhook():
    update = types.Update.de_json(request.json)
    dp.process_update(update)
    return 'OK', 200

@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    keyboard = types.InlineKeyboardMarkup()
    web_app_button = types.InlineKeyboardButton(text="Open Web App", web_app=types.WebAppInfo(url=WEB_APP_URL))
    keyboard.add(web_app_button)
    await message.reply("Welcome to the Notcoin Clicker Bot! Click the button below to start playing.", reply_markup=keyboard)

async def on_startup(dp):
    await bot.set_webhook(WEBHOOK_URL)

async def on_shutdown(dp):
    await bot.delete_webhook()

if __name__ == '__main__':
    start_webhook(
        dispatcher=dp,
        webhook_path=WEBHOOK_PATH,
        on_startup=on_startup,
        on_shutdown=on_shutdown,
        skip_updates=True,
        host='0.0.0.0',
        port=5000,
    )
