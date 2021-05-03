const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    game_id: Number,
    game_modes: [{id: Number, name: String}],
    genres: [{id: Number, name: String}],
    multiplayer_modes: [Number],
    name: String,
    cover: [Number],
    platforms: [Number],
    franchise_games: [Number],
    ports: [Number],
    remakes: [Number],
    remasters: [Number],
    rating: Number,
    rating_count: [Number],
    release_dates: [Number],
    screenshots: [{
        id: Number, 
        game: Number, 
        height: Number, 
        image_id: String,
        url: String,
        width: Number,
        checksum: String
    }],
    similar_games: [Number],
    status: Number,
    summary: String,
    videos: [Number]
})

const GameModel = mongoose.model('Game', gameSchema);
exports.gameSchema = gameSchema;
exports.Game = GameModel;