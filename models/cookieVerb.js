const mongoose = require('mongoose')
const Schema = mongoose.Schema

let cookieVerbSchema = Schema({
    CookieID: 0,
    verbs: [],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '8h'
    }
}, {
    versionKey: false
});

cookieVerbSchema.index({ createdAt: 1 }, { expireAfterSeconds: 28800 });

module.exports = mongoose.model("CookieVerb", cookieVerbSchema)
