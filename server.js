const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const axios = require('axios');
const filter = require('./filter')
require('dotenv').config();
let app = express();
const igdb = require('./queries');
const youtubeAPI = require('./queries');
const port = process.env.PORT || 5000;

const GameModel = require('./models/game');

app.use(cors());
app.use(express.json())
const TWITCH = { id: process.env.TWITCH_CLIENT_ID, secret: process.env.TWITCH_SECRET }
const IGDB_HEADER = {
    authorization: process.env.IGDB_AUTH
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

const getBoxArt = (endPoint, coverQuery) => {
    if (coverQuery[0].image_id) {
        return coverQuery
    } else {
        return axios({
            method: 'POST',
            url: `https://api.igdb.com/${endPoint}`,
            headers: {
                "Content-Type": "application/json",
                "Client-ID": TWITCH.id,
                "Authorization": `Bearer ${IGDB_HEADER.authorization}`
            },
            data: coverQuery
        })
    }
}
const getGameVideo = (gameName, youtubeAPI) => {
    return axios({
        method: 'GET',
        url: `${youtubeAPI.search}?part=snippet&maxResults=5&q=${gameName} Trailer&key=${process.env.YOUTUBE_KEY}`,
    })
    .then(response => response.data.items[0].id.videoId)
}

app.get('/authenticate', (req, res) => {
    fetch(`https://id.twitch.tv/oauth2/token?client_id=${TWITCH.id}&client_secret=${TWITCH.secret}&grant_type=client_credentials`)
        .then(response => console.log(response));
})


app.get('/games/:gameName', (req, res, next) => {
    getIgdbData(req.params.gameName, igdb.getUris.game)
    .then(response => {res.status(200).send(response.data); })
    .catch( e => console.log(e.message))
})

app.get('/recommendations', (req, res) => {
    fetch(`https://tastedive.com/api/similar?q=${app.locals.gameName}`)
        .then((data) => data.json())
        .then((json) => { res.status(200).send(json) })
        .catch(e=> console.log(e.message))
})
app.get('/boxart/:coverId', (req, res) =>{
    let coverQuery = igdb.getCoverByGameId(req.params.coverId);
    getBoxArt(igdb.getUris.cover, coverQuery)
    .then(response=> res.status(200).send(response.data))
    .catch(e=> console.log(e.message))
})

app.get('/video/:gameName', (req, res) =>{
    getGameVideo(req.params.gameName, youtubeAPI.getTrailers)
    .then((data)=> res.status(200).json(data))
    .catch(e=> res.status(403).send(e.message + " Daily Quota Exceeded"))
})

app.post('/add', (req, res) => {
    const game = req.body;

    const id = game.id;
    const gameModes = game.game_modes;
    const genres = game.genres;
    const name = game.name;
    const cover= game.cover;
    const platforms = game.platforms;
    const franchise = game.franchise;
    const ports = game.ports;
    const remakes = game.remakes;
    const remasters = game.remasters;
    const rating = game.rating;    
    const releaseDates = game.release_dates;
    const screenShots = game.screenshots;
    const similarGames = game.similar_games;
    const summary = game.summary;
    const videos = game.videos;

    const saveGame = new GameModel({
        id,
        gameModes,
        genres,
        name,
        cover,
        platforms,
        franchise,
        ports,
        remakes,
        remasters,
        rating,
        releaseDates,
        screenShots,
        similarGames,
        summary,
        videos
    })
    saveGame.save()
        .then(()=>{res.json('exercise added')})
        .catch((err)=> res.status(400).json("error: " + err ))
})

app.delete('/:id', (req, res) => {

})

app.post('/update/:id', (req, res) => {

})

app.get('/:id', (req, res)=>{

})

app.listen(port, () => {
    console.log(`Server listening on port:${port}`);
})
