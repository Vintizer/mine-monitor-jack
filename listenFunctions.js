
const { get_json, calculate } = require("./support")
// const { sendStartText, errQuantityMessage } = require("./support/textMessages")

const onTextAny = msg => {
    const { chat, text } = msg;
    console.log('onTextAny');
    console.log(chat.id);
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
}, 300000)

module.exports.onTextAny = onTextAny;
