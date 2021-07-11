const mongoose = require('mongoose')
const Schema = mongoose.Schema

let youtube_channel_schema = Schema({
    id: mongoose.Types.ObjectId,
    channel_id: String,
    name: String,
    description: String,
    custom_url: String,
    thumbnails: {
        default : String,
        medium: String,
        high: String
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("YoutubeChannel", youtube_channel_schema)
