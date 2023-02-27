require('dotenv').config();
const Web3 = require('web3')
const fs = require('fs');
const convertor = require('./convertor.js');
const { threadId } = require('worker_threads');



var web3 = new Web3(new Web3.providers.HttpProvider(process.env.NetworkURL));


let ABI = JSON.parse(fs.readFileSync('ABI.json'));



//web3@^1.8.1

// Set the contrcat address
var BetContract = new web3.eth.Contract(ABI, process.env.ContractAddress);



async function create_game(creator_address, amount_in_usdt) {
    try {
        var amount_in_wei = await convertor.usdt_to_wei(amount_in_usdt)
        var created_game = await BetContract.methods.create_game().send({ from: creator_address, gas: 3000000, value: amount_in_wei })
        return "done"
    }
    catch (err) {
        return err
    }
}

async function join_game(joiner_address, game_id) {
    try {
        var game_info = await get_games_info(game_id)
        var joined_game = await BetContract.methods.join_game(game_id).send({ from: joiner_address, gas: 3000000, value: game_info.amount })
        return "done"
    }
    catch (err) {
        return err
    }
}



async function get_game_ids() {
    try {
        var game_ids = await BetContract.methods.get_games_id().call()
        return game_ids
    }
    catch (err) {
        return err
    }

}

async function get_games_info(game_id) {
    try {
        var game_info = await BetContract.methods.get_game_info(game_id).call()
        return game_info
    }
    catch (err) {
        return err
    }

}


async function open_games() {
    try {
        var ids = await get_game_ids()

        var open_games = await Promise.all(await ids.map(async (data) => {
            var game_info = await get_games_info(data)
            if (game_info['is_finished'] === false) {
                return await game_info
            }

        }
        ))

        var filtered = open_games.filter(function (el) {
            return el != null;
        });


        return filtered

    }
    catch (err) {
        return err
    }

}



async function specific_games(address) {
    try {
        var ids = await get_game_ids()

        var games_data = await Promise.all(await ids.map(async (data) => {
            var game_info = await get_games_info(data)
            if (game_info['creator'] === address || game_info['joiner'] === address ) {
                return await game_info
            }

        }
        ))

        var filtered = games_data.filter(function (el) {
            return el != null;
        });


        return filtered

    }
    catch (err) {
        return err
    }

}



exports.create_game = create_game
exports.specific_games = specific_games
exports.open_games = open_games
exports.join_game = join_game
exports.get_game_ids = get_game_ids
exports.get_games_info = get_games_info


// console.log(process.env.From )
// get_game_ids().then(console.log)
// create_game(process.env.From , 100).then(console.log)
// join_game(2)

// join_game(process.env.joiner ,1).then(console.log)
// get_games_info(1).then(console.log)
// get_games_info(2).then(console.log)
// console.log(parseInt(1.5))
// web3.eth.getBalance(process.env.ContractAddress).then(console.log)
// console.log((60959626439409176 + 12169225246274696)/2)
