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

module.exports = {getNormalizedText, getNormalizedName, getNormalizedCategory}