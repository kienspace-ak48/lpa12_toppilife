const mongoose = require('mongoose');
const slugify = require('slugify');

const ProjectInfoSchema = new mongoose.Schema({
    name: String,
    ver: {type: String, default: '1.0'},
    author: {type: String, default: 'KienVu'} 
})

module.exports = mongoose.model("project_info", ProjectInfoSchema);