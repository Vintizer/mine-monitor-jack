const https = require('https');
const bot = require("../bot")
const config = require('../config.json');
const { getDataEthermine, getDataNanopool, getDataCoinmine, getDataSuprnova } = require("./getData")

const get_json = ({ user, url, pool, coin }) => {
    return new Promise(function (resolve, reject) {
        https.get(url, function (res) {
            let hashrate;
            let body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function () {
                let resBody;
                try {
                    resBody = JSON.parse(body);
                } catch (err) {
                }
                if (resBody) {
                    switch (pool) {
                        case "ethermine":
                            hashrate = getDataEthermine(resBody);
                            break;
                        case "nanopool":
                            hashrate = getDataNanopool(resBody);
                            break;
                        case "coinmine":
                            hashrate = getDataCoinmine(resBody, coin);
                            break;
                        case "suprnova":
                            hashrate = getDataSuprnova(resBody, coin);
                            break;
                    }
                    resolve({ hashrate, user, pool, coin });
                } else {
                    resolve({ hashrate: "ParseTrouble", user, pool, coin });
                }

            });
        });
    })
};

module.exports.calculate = (chatId) => {
    const urlArray = [];
    for (const user in config) {
        config[user].forEach(({ pool, coin, url, bound }) => {
            urlArray.push({
                pool,
                coin,
                url,
                user
            })
        })
    }
    Promise.all(urlArray.map(get_json))
        .then(arr => {
            let resText = "";
            if (chatId === 173191632) {
                arr.forEach(({ user, hashrate, coin }) => {
                    let userName;
                    switch (user) {
                        case "mom":
                            userName = "Мама - ";
                            if (hashrate !== false && (coin === "eth" && hashrate < 90 || coin === "btg" && hashrate < 0)) {
                                resText += "******************************************\n";
                            }   
                            break
                        case "sanya":
                            if (coin === "eth" && hashrate < 385) {
                                resText += "******************************************\n";
                                bot.sendMessage(
                                    478916730,
                                    "Скорость упала - " + hashrate + "\r\nГраничная скорость 370 Мн"
                                )
                            }
                            userName = "Саня - ";
                            break
                        case "me":
                            if (coin === "eth" && hashrate < 536 || coin === "zen" && hashrate < 30 || coin === "zcl" && hashrate < 250) {
                                resText += "******************************************\n";
                            }
                            userName = "Я - ";
                            break
                    }
                    resText += userName + coin.toUpperCase() + " - " + hashrate + " Mh\n";;
                })
            } else {
                arr.forEach(({ user, hashrate, coin }) => {
                    let userName;
                    switch (user) {
                        case "sanya":
                            resText += coin.toUpperCase() + " - " + hashrate + " Mh\n";
                            break
                    }
                })
            }
            if (resText.indexOf("********") > -1) {
                bot.sendMessage(
                    327277912,
                    resText
                )
            }
            bot.sendMessage(
                chatId,
                resText
            )
        })
        .catch(err => { console.log(err); })
}

module.exports.get_json = get_json;
