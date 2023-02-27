require('dotenv').config();
const Web3 = require('web3')
const fs = require('fs');



var web3 = new Web3(new Web3.providers.HttpProvider(process.env.NetworkURL));


let ABI = JSON.parse(fs.readFileSync('ABI.json'));


//web3@^1.8.1

// Set the contrcat address
var BetContract = new web3.eth.Contract(ABI, process.env.ContractAddress);



async function create_game() {
    var created_game = await BetContract.methods.create_game().send({ from: process.env.From, gas: 3000000, value: 2000000000000000000 })

}

async function join_game(id) {
    var game_info = await get_games_info(id)
    var joined_game = await BetContract.methods.join_game(id).send({ from: process.env.joiner, gas: 3000000, value: game_info.amount })
}



async function get_games_id() {
    var b = await BetContract.methods.get_games_id().call()
    console.log(b)

}

async function get_games_info(id) {
    // return await BetContract.methods.get_game_info(id).call()
    var b = await BetContract.methods.get_game_info(id).call()
    console.log(b)
}



get_games_info(2)
// join_game(2)