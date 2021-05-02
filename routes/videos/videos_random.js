const express = require('express');
const router = express.Router();

// Util
let get_playlist_items = require('/util/youtube_api').get_playlist_items
let random_integer = require('/util/random_integer').forceRandomInteger

router.get('/', function(req, res) {

    get_playlist_items("PLS5_eiO1TY81hW6XPzlWeW_BuCvAv0yDe").then((items) => {

        console.log("Length: " + items.length)

        let video_selected = items[random_integer(0, items.length - 1)]

        res.redirect(video_selected)
    })
})

module.exports = router;