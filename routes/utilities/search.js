var express = require('express');
var router = express.Router();

const Verb = require('/models/verb');
const Vocabulary = require('/models/vocabulary')

// GET /search - Search entire verb database using nameUTF8
router.post('/', function(req, res) {

    // Get rid of accents or weird stuff
    let search = (req.body.search).normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    Verb.find({nameUTF8: {'$regex': search }}).sort({nameUTF8: 1}).exec((err, verb_search) => {

        if(!err) {

            Vocabulary.find({nameUTF8: {'$regex': search}}).sort({nameUTF8: 1}).exec((err, vocabulary_search) => {

                if(!err){

                    res.render('search', {
                        verbs: verb_search,
                        vocabulary: vocabulary_search
                    })
                }
                else
                    res.render('error')
            })
        } else {
            res.render('error')
        }

    })
});

module.exports = router;