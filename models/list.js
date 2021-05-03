import gameSchema from './game';

const mongoose = require('mongoose');

const gameList = new mongoose.Schema({
    list: {
        type: gameSchema,
        default: {}
    }
})

const listModel = mongoose.model('list', gameList);
exports.list = listModel;