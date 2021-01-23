const mongoose = require('mongoose')
const Schema = mongoose.Schema

let cookieVocabularySchema = Schema({
    CookieID: 0,
    vocabulary: [],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '8h'
    }
}, {
    versionKey: false
});

cookieVocabularySchema.index({ createdAt: 1 }, { expireAfterSeconds: 28800 });

module.exports = mongoose.model("CookieVocabulary", cookieVocabularySchema)
