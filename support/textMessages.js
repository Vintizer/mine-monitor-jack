const {
  moneyData,
  exchange
} = require("../globals")

module.exports.getFinalMessage = (uahObject) => {
  let marketKuna;
  let marketBtcTrade;
  let count = 0;
  const res = {
    fullMessage: "Результаты в гривне (с учетом всех комиссий, таких как торговля, перевод с биржи на биржу и вывод на карту Приватбанка): \r\n"
  };
  let sum = 0;
  let value = 0;
  uahObject.map(({
    uahVal,
    coin,
    market
  }) => {
    if (market === "kuna") {
      if (!marketKuna) {
        res.fullMessage += "Вывод через биржу [Kuna](https://kuna.io/): \r\n";
        marketKuna = true
      }
    }
    if (market === "btctrade") {
      if (!marketBtcTrade) {
        res.fullMessage += "\r\nВывод через биржу [Btc-Trade](https://btc-trade.com.ua/): \r\n";
        marketBtcTrade = true
      }
    }
    res.fullMessage += "Монета _" + coin + "_ - *" + uahVal + "* грн \r\n";
    sum += uahVal;
    value++;
    if (uahVal > count) {
      count = uahVal;
      const marketBest = market === "btctrade" ?
        "[Btc-Trade Рынок " + coin + "](https://btc-trade.com.ua/stock/" + coin.toLowerCase() + "_uah)" :
        "[Kuna Рынок " + coin + "](https://kuna.io/markets/" + coin.toLowerCase() + "uah)";
      res.maxMessage = "Вы рассчитывали вывод с биржи " + exchange.getExchange() + ". Рассчетная сумма - *" +
        moneyData.getMoney().possibleVolume + "* _" + moneyData.getMoney().possibleCoin + "_\r\n" +
        "Вам надо купить на "+ exchange.getExchange() + " монету " + coin +
        "\r\nЗатем вывести ее на биржу " + marketBest + " и там обменять на гривну.\r\n" +
        "Лучший результат - *" + uahVal + "* грн\r\n" +
        "Биржа " + marketBest + " монета *" + coin + "*";
    }
  })
  const average = parseInt(sum / value, 10);
  res.average = "Среднее значение при выводе - *" + average + "*.\r\nБлагодаря боту вы заработали дополнительно -\r\n\r\n*" + (count - average) + "* грн."
  return res;
}

module.exports.sendStartText = 'СЕЙЧАС МОГУТ НАБЛЮДАТЬСЯ ПРОБЛЕМЫ С ПОЛУЧЕНИЕМ ДАННЫХ ОТ BTC-TRADE. К СОЖАЛЕНИЮ БОТ НЕ МОЖЕТ РАССЧИТАТЬ СУММУ В ГРИВНАХ. БОТ В ТЕСТОВОМ РЕЖИМЕ, ПРИХОДИТСЯ ЖДАТЬ ПОКА БИРЖА ОТДАСТ ДАННЫЕ. Просчет только через биржу Kuna отдельно не считает из-за низкой целесообразности \r\nВведите сумму, которую планируется вывести в гривну(сумма в долларах - просто целые цифры (без долей), сумма в BTC - цифры + слово BTC):'
module.exports.errQuantityMessage = 'Вы ввели некорректную сумму, пожалуста напишите еще раз. Напоминаю - сумма в долларах - просто целые цифры (без долей), сумма в BTC - цифры + слово BTC';
module.exports.errBtcTradeWait = "Btc trade не хочет отдавать данные часто, пожалуйста попробуйте через 5-10 секунд";
