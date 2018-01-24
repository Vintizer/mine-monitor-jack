
const { get_json, calculate } = require("./support")
// const { sendStartText, errQuantityMessage } = require("./support/textMessages")

const onTextAny = msg => {
    const { chat, text } = msg;
    switch (text) {
        // case "start":
        //     startMonitoring();
        //     break;
        // case "stop":
        //     stopMonitoring();
        //     break;
        default:
            calculate(chat.id);
            break;
    }
}
calculate(173191632);
setInterval(() => {
    calculate(173191632);
}, 600000)

module.exports.onTextAny = onTextAny;
