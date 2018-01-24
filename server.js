const { onTextAny } = require("./listenFunctions")
const bot = require("./bot")

bot.onText(/./, onTextAny);
