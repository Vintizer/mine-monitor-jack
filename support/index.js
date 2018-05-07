const https = require("https");
const bot = require("../bot");
const config = require("../config.json");
const {
  getDataEthermine,
  getDataNanopool,
  getDataCoinmine,
  getDataSuprnova
} = require("./getData");

const get_json = ({ user, url, pool, coin }) => {
  return new Promise(function(resolve, reject) {
    https.get(url, function(res) {
      let hashrate;
      let body = "";
      res.on("data", function(chunk) {
        body += chunk;
      });

      res.on("end", function() {
        let resBody;
        try {
          resBody = JSON.parse(body);
        } catch (err) {}
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
  });
};

module.exports.calculate = chatId => {
  let btgMomFalse = 0;
  let zenMyFalse = 0;
  let btgSanyaFalse = 0;
  const urlArray = [];
  for (const user in config) {
    config[user].forEach(({ pool, coin, url, bound }) => {
      urlArray.push({
        pool,
        coin,
        url,
        user
      });
    });
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
              if (hashrate !== false) {
                if (coin === "btg" && hashrate < 300) {
                    resText += "@@@@@@@@@@@@@@@@@\n";
                  if (btgMomFalse === 2) {
                    resText += "******************************************\n";
                  } else {
                    btgMomFalse++;
                  }
                } else {
                  btgMomFalse = 0;
                  if (coin === "eth" && hashrate < 48) {
                    resText += "******************************************\n";
                  }
                }
              }
              break;
            case "sanya":
              if (coin === "btg" && hashrate < 550) {
                resText += "@@@@@@@@@@@@@@@@@\n";
                if (btgSanyaFalse === 2) {
                  resText += "******************************************\n";
                  bot.sendMessage(
                    478916730,
                    "Скорость одной из монет(" +
                      coin +
                      ") упала - " +
                      hashrate +
                      "\r\n"
                  );
                } else {
                  btgSanyaFalse++;
                }
              } else {
                btgSanyaFalse = 0;
                if (coin === "eth" && hashrate < 330) {
                  resText += "******************************************\n";
                  bot.sendMessage(
                    478916730,
                    "Скорость одной из монет(" +
                      coin +
                      ") упала - " +
                      hashrate +
                      "\r\n"
                  );
                }
              }
              userName = "Саня - ";
              break;
            case "me":
              userName = "Я - ";
              if (coin === "zen" && hashrate < 100) {
                resText += "@@@@@@@@@@@@@@@@@\n";
              } else {
                zenMyFalse = 0;
                if (
                  (coin === "eth" && hashrate < 590) ||
                  (coin === "xvg" && hashrate < 15) ||
                  (coin === "zcl" && hashrate < 250)
                ) {
                  resText += "******************************************\n";
                }
              }

              break;
          }
          resText += userName + coin.toUpperCase() + " - " + hashrate + " Mh\n";
        });
      } else {
        arr.forEach(({ user, hashrate, coin }) => {
          let userName;
          switch (user) {
            case "sanya":
              resText += coin.toUpperCase() + " - " + hashrate + " Mh\n";
              break;
          }
        });
      }
      if (resText.indexOf("********") > -1) {
        bot.sendMessage(327277912, resText);
      }
      bot.sendMessage(chatId, resText);
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports.get_json = get_json;
