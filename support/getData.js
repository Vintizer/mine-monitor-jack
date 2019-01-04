const getDataEthermine = (data) => {
    if (data.status === "OK") {
        if (data.data.length) {
            let hashrateMap = {};
            return data.data.map(worker => {
                return {
                    workerName: worker.worker,
                    hashrate: worker.reportedHashrate / 1000000
                }
            });
        } else {
            console.log(parseFloat(data.data.usdPerMin) * 60 * 24 * 30);
            return parseInt(data.data.reportedHashrate / 1000000)
        }
    } else {
        return data.status;
    }
}
const getDataNanopool = (data) => {
    if (data && data.status === true) {
        return parseInt(data.data)
    } else {
        return data && data.status;
    }
}
const getDataCoinmine = (body, coin) => {
    // console.log('getDataCoinmine');
    // console.log(body);
}
const getDataSuprnova = (body, coin) => {
    switch (coin) {
        case "btg":
        case "zen":
        case "xvg":
        case "zcl":
            return parseInt(body.getuserstatus.data.hashrate / 1000);
            break;
    }
}

module.exports.getDataEthermine = getDataEthermine;
module.exports.getDataNanopool = getDataNanopool;
module.exports.getDataCoinmine = getDataCoinmine;
module.exports.getDataSuprnova = getDataSuprnova;