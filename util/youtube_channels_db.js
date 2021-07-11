const YoutubeChannel = require('/models/youtube_channel')

const get_youtube_channels_in_db = require('/util/youtube_channels').get_youtube_channels
const get_youtube_channel_info = require('/util/youtube_api').get_youtube_channel_info

let update_youtube_channels_db = async function(){

    let youtube_channels = await get_youtube_channels_in_db()

    for(let i = 0; i < youtube_channels.length; i++){

        let channel_info = await get_youtube_channel_info(youtube_channels[i])

        let save = await YoutubeChannel.findOneAndUpdate({channel_id: channel_info.channel_id}, channel_info, {upsert: true})
        console.log(save)
    }
}

module.exports = {update_youtube_channels_db}