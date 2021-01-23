const Vocabulary = require('/models/vocabulary')

function getIndexes(callback){

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1)
    }

    Vocabulary.distinct('category', (err, data) => {

        if(err)
            res.status(404).json({message: "error"})
        else
        {
            arrayTemp = []

            for(let i = 0; i < data.length; i++){
                jsonTemp = {}
                jsonTemp['index'] = data[i].capitalize()
                jsonTemp['path'] = data[i].replace(' ', '-')
                arrayTemp.push(jsonTemp)
            }

            return callback(JSON.parse(JSON.stringify(arrayTemp)))
        }
    })
}

module.exports = {getIndexes}