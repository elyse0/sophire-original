let getNormalizedText = function (text){

    let normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    normalizedText = normalizedText.replace('', '.')

    return normalizedText
}

module.exports = {getNormalizedText}