const Vocabulary = require('/models/vocabulary')
const normalization = require("./normalization");

function getIndexes(callback){

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1)
    }

    Vocabulary.distinct('category', (err, categories) => {

        if(err)
            res.status(404).json({message: "error"})
        else
        {
            arrayTemp = []

            for(let i = 0; i < categories.length; i++){
                jsonTemp = {}
                jsonTemp['index'] = categories[i].capitalize()
                jsonTemp['path'] = normalization.getNormalizedCategory(categories[i])
                arrayTemp.push(jsonTemp)
            }

            return callback(JSON.parse(JSON.stringify(arrayTemp)))
        }
    })
}

module.exports = {getIndexes}