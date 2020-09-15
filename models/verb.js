const mongoose = require('mongoose')
const Schema = mongoose.Schema

let verbSchema = Schema({
    id: mongoose.Types.ObjectId,
    name: String,
    nameUTF8: String,
    imageURL: String
}, {
    versionKey: false
});

module.exports = mongoose.model("Verb", verbSchema)
