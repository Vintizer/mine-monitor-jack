const TelegramBot = require('node-telegram-bot-api')
const TOKEN = '542127956:AAEaB4KLyperHUt_ugtBEnko_mzlECgLgFg'

const options = {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
}

module.exports = new TelegramBot(TOKEN, options)
