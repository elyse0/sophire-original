const express = require('express');
const router = express.Router();

const Videos = require('/models/video')

let get_youtube_channels_json = require('/util/youtube_channels').get_youtube_channels_json
let get_numerical_indexes = require('/util/indexes').get_numerical_indexes
const get_json_indexes = require('/util/verbs_indexes').getJsonIndexes

// Get /videos/:channel - Get list of videos from a Youtube Channel
router.get('/:channel', function (req, res) {

    let requested_channel = req.params.channel
    let index = req.query.index

    get_youtube_channels_json()
        .then((channels) => {

            // Get normalized names of youtube channels
            let youtube_channels_utf8 = channels.map((channel) => channel.channel_path)

            // Verify if channel exists in database
            if (!(youtube_channels_utf8.indexOf(requested_channel) > -1))
                return res.render('404')

            // Get channel's original name using his path
            let original_channel_name

            for(let i = 0; i < channels.length; i++){

                if(channels[i].channel_path === requested_channel){

                    original_channel_name = channels[i].name
                    break;
                }
            }

            Videos.find({channel_name: original_channel_name}).sort({_id: -1}).exec((err, data) => {

                if (err)
                    return res.render('404')

                // Handle indexes
                let numerical_indexes = get_numerical_indexes(data.length, 9)
                console.log(numerical_indexes)

                let inferior_limit
                let superior_limit

                try {
                    if(index === undefined)
                        index = 1

                    index = parseInt(index)
                } catch (e) {
                    index = 1
                }

                if (index > numerical_indexes.length) {
                    return res.render('404')
                }

                inferior_limit = (index - 1) * 9
                superior_limit = index * 9

                let videos = data.slice(inferior_limit, superior_limit)
                console.log("Inferior: " + inferior_limit)
                console.log("Superior: " + superior_limit)
                console.log(videos)

                return res.render('videos_info', {
                    channel_name: original_channel_name,
                    channel_path: requested_channel,
                    videos: videos,
                    indexes: get_json_indexes(numerical_indexes)
                })

            })
        })
        .catch((err) => {

            return res.render('404')
        })
})

module.exports = router;