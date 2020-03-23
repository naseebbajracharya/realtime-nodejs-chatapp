const mongoose = require('mongoose');

const groupName = mongoose.Schema({
    name: {
        type: String,
        default: ''
    },

    tagline: {
        type: String,
        default: ''
    },

    image: {
        type: String,
        default: 'groupsample.jpg'
    },

    followers: [{
        username: {type: String, default: ''},
        email: {type: String, default: ''}
    }],
    
})

module.exports = mongoose.model('Group', groupName);