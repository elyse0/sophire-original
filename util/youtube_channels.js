const Videos = require('/models/video')
const YoutubeChannels = require('/models/youtube_channel')

const get_normalized_category = require('/util/normalization').get_normalized_youtube_channel

let get_youtube_channels = async function(){

    let channels = await Videos.distinct('channel_id')

    console.log(channels)

    return channels.sort((a, b) => {

        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    });
}

let get_youtube_channels_json = async function (){

    let channels = await YoutubeChannels.find({})

    channels = channels.sort((a, b) => {

        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    });

    for (let i = 0; i < channels.length; i++) {

        channels[i]['channel_path'] = get_normalized_category(channels[i].name)
    }

    return channels
}

module.exports = {get_youtube_channels, get_youtube_channels_json}