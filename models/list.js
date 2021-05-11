const mongoose = require('mongoose');

const gameListSchema = new mongoose.Schema({
    list: Number,
    identifier: String
})

const ListModel = mongoose.model('favouriteGame', gameListSchema);
module.exports = ListModel;