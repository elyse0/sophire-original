const mongoose = require('mongoose')
const Schema = mongoose.Schema

let vocabularySchema = Schema({
    id: mongoose.Types.ObjectId,
    name: String,
    nameUTF8: String,
    imageURL: String,
    category: String
}, {
    versionKey: false
});

module.exports = mongoose.model("Vocabulary", vocabularySchema)
