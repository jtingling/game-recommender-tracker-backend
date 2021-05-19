const mongoose = require('mongoose');

const gameModesSchema = new mongoose.Schema({
    id: Number, 
    name: String,
})
const gameGenre = new mongoose.Schema({
    id: Number, 
    name: String,
})

const screenShotSchema = new mongoose.Schema({
    id: Number,
    alpha_channel: Boolean,
    animated: Boolean,
    game: Number, 
    height: Number, 
    image_id: String,
    url: String,
    width: Number,
    checksum: String,
});

const gameSchema = new mongoose.Schema({
    gameId: Number,
    gameModes: [gameModesSchema],
    genres: [gameGenre],
    name: String,
    cover: String,
    platforms: [Number],
    franchiseGames: [{id: Number, games:[Number]}],
    ports: [Number],
    remakes: [Number],
    remasters: [Number],
    rating: Number,
    releaseDates: [Number],
    screenShots: [screenShotSchema],
    similarGames: [Number],
    summary: String,
    videos: [Number]
})


const GameModel = mongoose.model('SavedGame', gameSchema);

module.exports = GameModel;

