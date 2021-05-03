const express = require('express');
const router = express.Router();

// Util
const get_videos = require('/routes/videos_api/videos_api_get').get_videos
let random_integer = require('/util/random_integer').forceRandomInteger

router.get('/', function (req, res) {

    get_videos()
        .then((videos) => {

            let video_selected = videos[random_integer(0, videos.length - 1)]
            return res.redirect("https://youtu.be/" + video_selected.video_id)
        })
        .catch((error) => {

            console.log(error)
            return res.render('404')
        })
})

module.exports = router;