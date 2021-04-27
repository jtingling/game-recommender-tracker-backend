const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const axios = require('axios');
const filter = require('./filter')
require('dotenv').config();
let app = express();
const igdb = require('./queries');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())
const TWITCH = { id: process.env.TWITCH_CLIENT_ID, secret: process.env.TWITCH_SECRET }
const IGDB_HEADER = {
    authorization: "8jag72ceoqm11s1nomu5y5veup55zg"
}
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', (e)=> console.log(e.message));
mongoose.connection.once('open', ()=> console.log("Connection to DB established."));

const getIgdbData = (gameName, endPoint) => {
    let query = igdb.createQuery(gameName);
    return axios({
        method: 'POST',
        url: `https://api.igdb.com/${endPoint}`,
        headers: {
            "Content-Type": "application/json",
            "Client-ID": TWITCH.id,
            "Authorization": `Bearer ${IGDB_HEADER.authorization}`
        },
        data: query
    })
}

const getBoxArt = (gameName) => {
    return axios({
        method: 'GET',
        url: `https://api.twitch.tv/helix/games?name=${gameName}`,
        headers: {
            "Client-ID": TWITCH.id,
            "Authorization": `Bearer ${IGDB_HEADER.authorization}`
        }
    })
}

app.get('/authenticate', (req, res) => {
    fetch(`https://id.twitch.tv/oauth2/token?client_id=${TWITCH.id}&client_secret=${TWITCH.secret}&grant_type=client_credentials`)
        .then(response => console.log(response));
})


app.get('/games/:gameName', (req, res, next) => {
    app.locals.gameName = req.params.gameName;
    getIgdbData(app.locals.gameName, igdb.getUris.game)
    .then(response => {res.status(200).send(response.data); console.log("IGDB Response OK.")})
    .catch( e => console.log(e.message))
})
app.get('/search/:id', (req, res)=>{

})

app.get('/recommendations', (req, res) => {
    fetch(`https://tastedive.com/api/similar?q=${app.locals.gameName}`)
        .then((data) => data.json())
        .then((json) => { res.status(200).send(json) })
        .catch(e=> console.log(e.message))
})
app.get('/boxart/:gameName', (req, res) =>{
    getBoxArt(req.params.getName)
    .then((data)=> res.status(200).send(data))
    .catch(e=> console.log(e.message))
})
app.get('/')

app.listen(port, () => {
    console.log(`Server listening on port:${port}`);
})