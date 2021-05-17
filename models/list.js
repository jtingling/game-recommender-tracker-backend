const mongoose = require('mongoose');

const favouriteGamesSchema = new mongoose.Schema({
    gameIds: [Number],
    favouriteId: String
})

const FavouriteGames = mongoose.model('FavouriteGame', favouriteGamesSchema);

module.exports = FavouriteGames;