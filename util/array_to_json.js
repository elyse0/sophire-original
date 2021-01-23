
function arrayToJson(array){

    var arrayToString = JSON.stringify(Object.assign({}, array));  // convert array to string
    // convert string to json object
    return JSON.parse(arrayToString)
}

module.exports = {arrayToJson}