const TelegramBot = require('node-telegram-bot-api')
const TOKEN = '542127956:AAF6UoO7JY-dAdg9pQ9lwQqILfq7A2Xdt1g'

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
