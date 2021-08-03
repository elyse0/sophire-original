const mongoose = require('mongoose')
const Schema = mongoose.Schema

let video_schema = Schema({
    id: mongoose.Types.ObjectId,
    video_id: String,
    description: String,
    date: String,
    thumbnail_default_url: String,
    channel_name: String,
    channel_id: String
}, {
    versionKey: false
});

module.exports = mongoose.model("Video", video_schema)
