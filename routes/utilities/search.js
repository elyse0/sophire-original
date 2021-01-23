var express = require('express');
var router = express.Router();

const Verb = require('/models/verb');

// GET /search - Search entire verb database using nameUTF8
router.post('/', function(req, res) {

    // Get rid of accents or weird stuff
    let search = (req.body.search).normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    Verb.find({nameUTF8: {'$regex': search }}).sort({nameUTF8: 1}).exec((err, data) => {

        if(err)
            res.status(404).json({message: "Error!"})
        else {
            res.render('search', {verbs: data})
            console.log(data)
        }
    })
});

module.exports = router;