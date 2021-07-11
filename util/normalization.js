let getNormalizedText = function (text){

    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

let getNormalizedName = function (text){

    let normalizedText = getNormalizedText(text)

    normalizedText = normalizedText.replace(/'/, '.')
    normalizedText = normalizedText.replace(/ /g, '.')

    return normalizedText
}

let getNormalizedCategory = function (text){

    let normalizedText = getNormalizedText(text)

    normalizedText = normalizedText.replace(/ /g, '-')
    normalizedText = normalizedText.replace(/'/, '.')

    return normalizedText
}

let get_normalized_youtube_channel = function(youtube_channel){

    let normalized_channel = getNormalizedText(youtube_channel)

    normalized_channel =  normalized_channel.replace(/ - /, '-')
    normalized_channel =  normalized_channel.replace(/ +/g, '-')
    normalized_channel = normalized_channel.replace(/'/, '.')
    normalized_channel = normalized_channel.replace(/’/, '.')
    normalized_channel = normalized_channel.replace(/,/, '')
    normalized_channel = normalized_channel.toLowerCase()

    return normalized_channel
}

module.exports = {getNormalizedText, getNormalizedName, getNormalizedCategory,
get_normalized_youtube_channel}