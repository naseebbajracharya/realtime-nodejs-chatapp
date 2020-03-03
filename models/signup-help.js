const mongoose = require ('mongoose');
var signupHelpSchema = mongoose.Schema({
    email: {
        type: String
    },

    requestedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SignUpHelp', signupHelpSchema);