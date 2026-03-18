const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    path: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model('folder', folderSchema);