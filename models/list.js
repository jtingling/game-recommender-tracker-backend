const mongoose = require('mongoose');

const favouriteGamesSchema = new mongoose.Schema({
    id: [Number],
    favouriteId: String
})

const FavouriteGames = mongoose.model('FavouriteGame', favouriteGamesSchema);

module.exports = FavouriteGames;