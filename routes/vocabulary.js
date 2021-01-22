const express = require('express');
const router = express.Router();

const Vocabulary = require('../models/vocabulary')

// Get /vocabulary - Get list of vocabulary by category --> default: ?
router.get('/', function(req, res) {

    Vocabulary.find().sort({nameUTF8: 1}).exec(function (err, data) {

        if(err)
            res.status(404).json({message: "error"})
        else
            res.render('vocabulary', {title: 'Suffire | French verbs', vocabulary: data});
    })
});

module.exports = router;