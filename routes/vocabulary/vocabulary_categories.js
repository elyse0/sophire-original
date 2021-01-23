const express = require('express');
const router = express.Router();

const Vocabulary = require('/models/vocabulary')

let vocabularyIndexes = require('/util/vocabulary_indexes')

// Get /vocabulary/:category - Get list of vocabulary by category --> default: ?
router.get('/:category', function(req, res) {

    let jsonIndexes = {}
    vocabularyIndexes.getIndexes((res) => jsonIndexes = res)

    let categoryRequested = req.params.category.replace('-', ' ')

    console.log(categoryRequested)

    Vocabulary.find({category: categoryRequested}).sort({nameUTF8: 1}).exec(function (err, data) {

        if(err)
            res.status(404).json({message: "error"})
        else
        {
            if(data.length === 0){
                res.render('error')
            }else{
                res.render('vocabulary', {
                    title: 'Suffire | French verbs',
                    indexes: jsonIndexes,
                    vocabulary: data,
                    category: categoryRequested.capitalize()
                });
            }
        }
    })
});

module.exports = router;