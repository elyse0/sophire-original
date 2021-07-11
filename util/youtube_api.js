const axios = require('axios')

let get_playlist_items = async function (playlist_id,
                                         page_token = undefined,
                                         key = process.env.youtube_api_key) {

    let request = "https://youtube.googleapis.com/youtube/v3/playlistItems" +
        "?part=snippet" +
        "&maxResults=50"

    if (page_token) {
        request += "&pageToken=" + page_token
    }

    request +=
        "&playlistId=" + playlist_id +
        "&key=" + key

    let response = await axios.get(request)

    let array_items = response.data.items.map((item) => {

        return {
            video_id: item.snippet.resourceId.videoId,
            description: item.snippet.description,
            thumbnail_default_url: item.snippet.thumbnails.default.url,
            channel_name: item.snippet.videoOwnerChannelTitle,
            channel_id: item.snippet.videoOwnerChannelId
        }
    })

    if (response.data.nextPageToken) {

        return array_items.concat(await get_playlist_items(playlist_id, response.data.nextPageToken))
    } else {

        return array_items
    }
}

let get_youtube_channel_info = async function (channel_id, key = process.env.youtube_api_key) {

    let request = "https://youtube.googleapis.com/youtube/v3/channels" +
        "?part=snippet%2CcontentDetails" +
        "&id=" + channel_id +
        "&key=" + key

    let response = await axios.get(request)

    let channel_info = response.data.items[0]

    return {
        channel_id: channel_info.id,
        name: channel_info.snippet.title,
        description: channel_info.snippet.description,
        custom_url: channel_info.snippet.customUrl,
        thumbnails: {
            default: channel_info.snippet.thumbnails.default.url,
            medium: channel_info.snippet.thumbnails.medium.url,
            high: channel_info.snippet.thumbnails.high.url
        }
    }
}

module.exports = {get_playlist_items, get_youtube_channel_info}