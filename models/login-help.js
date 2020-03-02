const mongoose = require ('mongoose');
var loginHelpSchema = mongoose.Schema({
    email: {
        type: String
    },

    requestedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LoginHelp', loginHelpSchema);