var express = require('express');
var router = express.Router();

const Verb = require('/models/verb');

// Get /verbs - Get list of verbs by index --> default: all
router.get('/', function(req, res) {

    index = req.query.index

    indexes = 'abcdefghijklmnopqrstuvwxyz'.split('').concat(["all"])

    arrayTemp = []

    for(let i = 0; i < indexes.length; i++){
        jsonTemp = {}
        jsonTemp['index'] = indexes[i]
        arrayTemp.push(jsonTemp)
    }

    jsonIndexes = JSON.parse(JSON.stringify(arrayTemp))


    if(indexes.includes(index)){

        if(index === "all"){
            Verb.find().sort({nameUTF8: 1}).exec(function (err, data) {

                if(err)
                    res.status(404).json({message: "error"})
                else
                    res.render('verbs', {title: 'Suffire | French verbs', verbs: data, indexes: jsonIndexes});
            })
        }
        else{

            Verb.find({nameUTF8: { '$regex': "^" + index}}).sort({nameUTF8: 1}).exec(function (err, data) {

                if(err)
                    res.status(404).json({message: "error"})
                else
                    res.render('verbs', {title: 'Suffire | French verbs', verbs: data, indexes: jsonIndexes});
            })
        }
    }
    else if(index === undefined){
        Verb.find({nameUTF8: { '$regex': "^a"}}).sort({nameUTF8: 1}).exec(function (err, data) {

            if(err)
                res.status(404).json({message: "error"})
            else
                res.render('verbs', {title: 'Suffire | French verbs', verbs: data, indexes: jsonIndexes});
        })
    }
    else
        res.status(404).json({message: "error"})
});


module.exports = router;
