const express = require('express');
const router = express.Router();

// Util
const apiAuth = require('/util/auth_api')
const set_difference = require('/util/set_operations').setDifference
let get_playlist_items = require('/util/youtube_api').get_playlist_items
let update_youtube_channels_db = require('/util/youtube_channels_db').update_youtube_channels_db

// Model
const Videos = require('/models/video')

let save_video = async function (video_json) {

    let video_db = Videos(video_json)

    return await video_db.save()
}

let get_difference_between_playlist_and_db = async function () {

    let playlist_items = await get_playlist_items("PLS5_eiO1TY81hW6XPzlWeW_BuCvAv0yDe")
    let database_items = await Videos.find({}, {_id: false})

    let playlist_items_id_set = new Set(playlist_items.map((item) => item.video_id))
    let database_items_id_set = new Set(database_items.map((item) => item.video_id))

    console.log("Items in playlist: " + playlist_items_id_set.size)
    console.log("Items in database: " + database_items_id_set.size)

    let difference_id = Array.from(set_difference(playlist_items_id_set, database_items_id_set))
    console.log("Difference: " + difference_id)

    let difference = playlist_items.filter((item) => {

        if (difference_id.includes(item.video_id)) {

            return true
        }
    })

    return difference
}

// POST / - Update database
router.post('/', apiAuth.checkJwt, (req, res) => {

    get_difference_between_playlist_and_db()
        .then((difference) => {

            for (let i = 0; i < difference.length; i++) {

                save_video(difference[i]).then(r => console.log(r))
            }

            update_youtube_channels_db().then(() => {

                return res.status(200).json({message: "Items and channels updated"})
            })
        })
        .catch((error) => {

            return res.status(500).json({message: "Error"})
        })
});

module.exports = router