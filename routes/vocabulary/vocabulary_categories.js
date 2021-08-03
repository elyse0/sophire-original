const express = require('express');
const router = express.Router();

const Vocabulary = require('/models/vocabulary')

let vocabularyIndexes = require('/util/vocabulary_indexes')

// Get /vocabulary/:category - Get list of vocabulary by category --> default: ?
router.get('/:category', function(req, res) {

    let categoryRequested = req.params.category
    let jsonIndexes = {}

    vocabularyIndexes.getIndexes((indexes) => {

        jsonIndexes = indexes

        Vocabulary.find({categoryUTF8: categoryRequested}).sort({nameUTF8: 1}).exec(function (err, data) {

            if(err)
                return res.status(404).json({message: "error"})

            if(data.length === 0)
                return res.render('404')

            res.render('vocabulary', {
                title: "Vocabulaire en français - Sophire",
                indexes: jsonIndexes,
                vocabulary: data,
                category: data[0].category
            });
        })
    })




});

module.exports = router;