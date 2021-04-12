const express = require('express');
const router = express.Router();

const Vocabulary = require('/models/vocabulary')

router.get('/:category/:vocabularyID', (req, res) => {

    let requestedCategory = req.params.category.replace('-', " ")
    let requestedVocabulary = req.params.vocabularyID.replace('-', ".")
    console.log("Category: " + requestedCategory)
    console.log("Vocabulary: " + requestedVocabulary)

    Vocabulary.findOne({category: requestedCategory, nameUTF8: requestedVocabulary}).sort({nameUTF8: 1}).exec((err, data) => {

        if(err)
            res.status(404).json({message: "Error!"})

        if(data === null)
            res.render('404')

        res.render('vocabulary_info', {vocabulary: data})
    })
})

module.exports = router