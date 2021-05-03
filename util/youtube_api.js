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

    if(response.data.nextPageToken){

        return array_items.concat(await get_playlist_items(playlist_id, response.data.nextPageToken))
    } else{

        return array_items
    }
}

module.exports = {get_playlist_items}