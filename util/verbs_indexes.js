
let getJsonIndexes = function (indexes){

    arrayTemp = []

    for(let i = 0; i < indexes.length; i++){
        jsonTemp = {}
        jsonTemp['index'] = indexes[i]
        arrayTemp.push(jsonTemp)
    }

    return JSON.parse(JSON.stringify(arrayTemp))
}

module.exports = {getJsonIndexes}