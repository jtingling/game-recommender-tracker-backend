const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const axios = require('axios');
require('dotenv').config();
let app = express();
const igdb = require('./queries');
const {searchOneById}  = require('./queries');
const youtubeAPI = require('./queries');
const port = process.env.PORT || 5000;

const GameModel = require('./models/game');
const FavouriteGames = require('./models/list');

app.use(cors());
app.use(express.json())
const TWITCH = { id: process.env.TWITCH_CLIENT_ID, secret: process.env.TWITCH_SECRET }
const IGDB_HEADER = {
    authorization: process.env.IGDB_AUTH
}
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (e) => console.log(e.message));
mongoose.connection.once('open', () => console.log("Connection to DB established."));

//IGDB
app.get('/authenticate', (req, res) => {
    fetch(`https://id.twitch.tv/oauth2/token?client_id=${TWITCH.id}&client_secret=${TWITCH.secret}&grant_type=client_credentials`)
        .then(response => console.log(response));
})

const getIgdbData = (gameName, endPoint) => {
    let query = igdb.createQuery(gameName);
    return axios({
        method: 'POST',
        url: `https://api.igdb.com/${endPoint}`,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Methods': '*',
            "Access-Control-Allow-Headers": "*",
            "Client-ID": TWITCH.id,
            "Authorization": `Bearer ${IGDB_HEADER.authorization}`
        },
        data: query
    })
}

app.get('/games/:gameName', (req, res) => {
    getIgdbData(req.params.gameName, igdb.getUris.game)
    .then(response => res.status(200).send(response.data))
    .catch(e => console.log(e.message))
})

app.get('/favourites', (req, res) => {
    const query = searchOneById(req.query.id)
    axios({
        method: 'POST',
        url: `https://api.igdb.com/${igdb.getUris.multiQuery}`,
        headers: {
            "Content-Type": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Methods': '*',
            "Access-Control-Allow-Headers": "*",
            "Client-ID": TWITCH.id,
            "Authorization": `Bearer ${IGDB_HEADER.authorization}`
        },
        data: query
    })
    .then( response => res.status(200).send(response.data[0].result))
    .catch(err => console.log(err))
})

//Youtube
const getGameVideo = (gameName, youtubeAPI) => {
    return axios({
        method: 'GET',
        url: `${youtubeAPI.search}?part=snippet&maxResults=5&q=${gameName} Trailer&key=${process.env.YOUTUBE_KEY}`,
    })
        .then(response => response.data.items[0].id.videoId)
}

app.get('/video/:gameName', (req, res) => {
    getGameVideo(req.params.gameName, youtubeAPI.getTrailers)
        .then((data) => res.status(200).json(data))
        .catch(e => res.status(403).send(e.message + " Daily Quota Exceeded"))
})

//MongoDB

app.post('/add/game', async (req, res) => {
    let checkGame = await GameModel.exists({"name": req.body.name});

    if (!checkGame) {
        const game = req.body;
        const id = game.id;
        const gameModes = game.game_modes;
        const genres = game.genres;
        const name = game.name;
        const cover = game.cover.image_id;
        const platforms = game.platforms;
        const franchiseGames = game.franchises;
        const ports = game.ports;
        const remakes = game.remakes;
        const remasters = game.remasters;
        const rating = game.rating;
        const releaseDates = game.release_dates;
        const screenShots = game.screenshots;
        const similarGames = game.similar_games;
        const summary = game.summary;
        const videos = game.videos;
        const newGame = new GameModel({
            id,
            gameModes,
            genres,
            name,
            cover,
            platforms,
            franchiseGames,
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
        newGame.save(function(err) {
            if (err) {
                console.log(err)
                return;
            }
            res.json("New game document created")
        })
    } else {
        res.json("Game already exists in DB")
    }
})

app.post('/add/favourites', async (req, res) => {
    const gameId = req.body.id;
    const favouriteId = req.body.favouriteId;
    let user = await FavouriteGames.exists({"favouriteId": favouriteId});
    if (user) {
        FavouriteGames.findOneAndUpdate({"favouriteId": favouriteId},{$push: {"id": gameId}},{new: true}, (err, query) =>{
            if (err) {
                console.log(err)
            } else {
                console.log(`Game Id: ${gameId} added to list: ${favouriteId}`);
                res.status(200).json(query);
            }
        })
    } else {
        const saveGameToList = new FavouriteGames({
            gameId,
            favouriteId,
        })
        saveGameToList.save(function(err) {
            if (err) {
                console.log(err)
                return;
            }
            res.json("New user list document created")
        })
    }
})

app.post('/remove', async (req, res) => {
    let user = await FavouriteGames.exists({"favouriteId": req.body.favouriteListKey});
    if (user) {
        FavouriteGames.findOneAndUpdate({"favouriteId": req.body.favouriteListKey}, {$set: {"id": req.body.newFavourites}}, {new: false}, (err, query)=> {

            if (err) {
                console.log(err)
            } else {
                console.log(`Game Id: ${req.body.id} removed from list: ${req.body.favouriteListKey}`);
                res.status(200).end();
            }
        })

    }    
})
app.get('/getList/:favouriteListKey', async (req, res) => {
    try {
        let user = await FavouriteGames.exists({"favouriteId": req.params.favouriteListKey});
        if (user) {
            FavouriteGames.find({"favouriteId": req.params.favouriteListKey}, (err, document) =>{
                if (err) {
                    console.log(err.status)
                } else {
                    res.status(200).json(document[0].id);
                }
            })
        }
    } catch (e) {
        res.send(e);
    }
})

app.listen(port, () => {
    console.log(`Server listening on port:${port}`);
})
