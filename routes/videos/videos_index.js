const express = require('express');
const router = express.Router();

const get_youtube_channels_json = require('/util/youtube_channels').get_youtube_channels_json

router.get('/', function (req, res) {

    get_youtube_channels_json()
        .then((channels) => {

            return res.render('videos', {
                title: "Chaînes de YouTube - Sophire",
                channels: channels})
        })
        .catch((err) => {

            console.log(err)
            return res.render('404')
        })
});

module.exports = router;
