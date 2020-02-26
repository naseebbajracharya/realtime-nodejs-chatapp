const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },

    fullname: {
        type: String,
        unique: true,
        default: ''
    },

    email: {
        type: String,
        unique: true
    },

    password: {
        type: String,
        default: ''
    },

    cnumber: {
        type: Number,
        default: ''
    },

    userImage: {
        type: String,
        default: 'icon.jpg'
    },

    facebook: {
        type: String,
        default: ''
    },

    twitter: {
        type: String,
        default: ''
    },

    github: {
        type: String,
        default: ''
    },

    gender: {
        type: String,
        default: ''
    },

    country: {
        type: String,
        default: ''
    },

    bio: {
        type: String,
        default: ''
    },

    favGroup: [{
        groupName: {type: String, default: ''},
    }],

    fbTokens: Array,

    google: {
        type: String,
        default: ''
    },

    googleTokens: Array,

    sentRequest: [{
        username: {type: String, default: ''}
    }],

    request: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
        username: {type: String, default: ''}
    }],

    friendsList: [{
        friendId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
        friendName: {type: String, default: ''}
    }],

    totalRequest: {type: Number, default: 0}
});

//Encrypt User's Password
userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null);
}

//Decrypt User's Password
userSchema.methods.validUserPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);