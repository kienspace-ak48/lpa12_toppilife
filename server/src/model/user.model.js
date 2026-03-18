const mongoose = require('mongoose');

const UserSchema =new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    phone: String,
    avatar: String,
    status: {type: Boolean, default: false},
    role: {type: String, default: 'user'}
}, {timestamps: true});

module.exports = mongoose.model('user', UserSchema)