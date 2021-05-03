const express = require('express');
const router = express.Router();

const Videos = require('/models/video')

let get_videos = async function (){

    return await Videos.find({}).sort({channel_name: 1})
}

// GET / - Get entire database of videos
router.get('/', (req, res) => {

    get_videos()
        .then((videos) => {

            res.status(200).json(videos)
        })
        .catch((error) => {

            console.log(error)
            res.status(500).json({message: "Error"})
        })
});

module.exports = {router, get_videos}