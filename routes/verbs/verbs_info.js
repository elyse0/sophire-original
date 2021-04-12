const express = require('express');
const router = express.Router();

const Verb = require('/models/verb')

router.get('/:verbID', (req, res) => {

    let requestedVerb = req.params.verbID

    Verb.findOne({nameUTF8: requestedVerb}).sort({nameUTF8: 1}).exec((err, data) => {

        if(err)
            res.render('404')

        if(data == null)
            res.render('404')

        res.render('verbs_info', {verb: data})
    })
})

module.exports = router