var convertor = require('./convertor.js')
var bet = require('./Chance.js')
var express = require('express')
var app = express();

app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
app.get('/create_game', async function (req, res) {
    var address = req.query.address;
    var value = req.query.value;
    await bet.create_game(address,parseInt(value))
    res.send('ok')
});


// index page
app.get('/open_games', async function (req, res) {
    var open_games = await bet.open_games()
    res.send(open_games)
});


app.get('/specific_games', async function (req, res) {
    var games_data = await bet.specific_games(req.query.address)
    res.send(games_data);
});


app.get('/join_game', async function (req, res) {
    var address = req.query.address;
    var id = req.query.id;
    var games_data = await bet.join_game(address,parseInt(id))
    res.send("ok");
});


app.listen(8080);
console.log('Server is listening on port 8080');
