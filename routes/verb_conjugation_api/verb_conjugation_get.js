const express = require('express');
const router = express.Router();
const axios = require('axios');

const verb_conjugation = require('/models/verb_conjugation');

router.get('/', (req, res) => {

    verb_conjugation.find({}).sort({"verb.infinitive": 1}).exec((err, data) => {

        if(err)
            return res.status(404).json("Error getting verb conjugations")

        return res.status(200).json(data)
    })
})

router.get('/:name', (req, res) => {

    verb_conjugation.findOne({"verb.infinitive": req.params.name}, (err, data) => {

        if(err)
            return res.status(404).json("Error getting verb conjugation")

        return res.status(200).json(data)
    })
})

module.exports = router;