const express = require('express');
const router = express.Router();

const Vocabulary = require('/models/vocabulary')

let vocabularyIndexes = require('/util/vocabulary_indexes')

// Get /vocabulary - Get list of vocabulary
router.get('/', function(req, res) {

    let jsonIndexes = {}
    vocabularyIndexes.getIndexes((indexes) => {

        jsonIndexes = indexes

        Vocabulary.find().sort({nameUTF8: 1}).exec(function (err, data) {

            if(err)
                res.render('404')
            else
                res.render('vocabulary', {
                    title: "Vocabulaire en français - Sophire",
                    vocabulary: data,
                    indexes: jsonIndexes
                });
        })
    })
});

module.exports = router;