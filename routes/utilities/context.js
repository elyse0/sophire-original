var express = require('express');
var router = express.Router();
const Reverso = require('reverso-api');

const reverso = new Reverso();

// Schemas from Mongoose
const Verb = require('/models/verb');
const CookieVerb = require('/models/cookieVerb');

router.get('/', (req, res) =>{

    console.log("Got it")

    reverso.getContext('hope', 'English', "Spanish").then(response => {
        console.log(response)
        res.status(200).json(response)
    }).catch(err => {
        res.status(500).json({message: "Error!"})
    });
})

module.exports = router;