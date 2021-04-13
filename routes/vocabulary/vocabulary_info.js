const express = require('express');
const router = express.Router();

const Vocabulary = require('/models/vocabulary')

router.get('/:category/:vocabularyID', (req, res) => {

    let requestedCategory = req.params.category
    let requestedVocabulary = req.params.vocabularyID
    console.log("Category: " + requestedCategory)
    console.log("Vocabulary: " + requestedVocabulary)

    Vocabulary.findOne({categoryUTF8: requestedCategory, nameUTF8: requestedVocabulary}).sort({nameUTF8: 1}).exec((err, data) => {

        if(err)
            return res.status(404).json({message: "Error!"})

        if(data === null)
            return res.render('404')

        res.render('vocabulary_info', {vocabulary: data})
    })
})

module.exports = router