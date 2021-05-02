const axios = require('axios')

let get_playlist_items = async function (playlist_id,
                                         page_token = undefined,
                                         key = process.env.youtube_api_key) {

    let request = "https://youtube.googleapis.com/youtube/v3/playlistItems" +
        "?part=contentDetails&part=id" +
        "&maxResults=50"

    if (page_token) {
        request += "&pageToken=" + page_token
    }

    request +=
        "&playlistId=" + playlist_id +
        "&key=" + key

    let response = await axios.get(request)

    let array_items = response.data.items.map((item) => "https://youtu.be/" + item.contentDetails.videoId)

    if(response.data.nextPageToken){

        return array_items.concat(await get_playlist_items(playlist_id, response.data.nextPageToken))
    } else{

        return array_items
    }
}

module.exports = {get_playlist_items}