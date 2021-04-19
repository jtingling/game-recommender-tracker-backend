const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fetch = require('node-fetch')
require('dotenv').config()
let app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())
const TWITCH = {id: process.env.TWITCH_CLIENT_ID, secret: process.env.TWITCH_SECRET}
app.get('/', (req, res)=>{
    fetch(`https://id.twitch.tv/oauth2/token?client_id=${TWITCH.id}&client_secret=${TWITCH.secret}&grant_type=client_credentials`, { method: 'POST', body:'a=1'})
        .then(res => res.json())
        .then( json => res.send(json))
})

app.listen(port, () => {
    console.log(`Server listening on port:${port}`);
})