var axios = require('axios');


var one_wei =  1000000000000000000

async function get_eth_price() {

    var Result;
    var config = {
        method: 'post',
        url: `https://api.nobitex.ir/market/global-stats`,
        };

    await axios(config)
        .then(function (response) {
            Result = response.data.markets.binance.eth
        })
        .catch(function (error) {
            console.log(error);
        });

    return Result
}


async function usdt_to_wei(amount_usdt) {
    var eth_price = await get_eth_price()
    var eth_value = amount_usdt / eth_price
    var amount_wei = eth_value * one_wei;
    return amount_wei
    
}

async function wei_to_usdt(amount_wei) {
    var eth_price = await get_eth_price()
    var eth_value = amount_wei / one_wei
    var amount_usdt = eth_value * eth_price;
    return amount_usdt
    
}

// wei_to_usdt(36564425842841936).then(console.log)

exports.usdt_to_wei = usdt_to_wei
// 36564425842841936