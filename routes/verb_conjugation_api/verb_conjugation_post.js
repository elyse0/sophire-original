const express = require('express');
const router = express.Router();

// Util
const apiAuth = require('/util/auth_api')

// Functions
let is_conjugation_in_database = require('/routes/verb_conjugation_api/verb_conjugation_util').is_conjugation_in_database
let get_conjugation = require('/routes/verb_conjugation_api/verb_conjugation_util').get_conjugation
let save_conjugation = require('/routes/verb_conjugation_api/verb_conjugation_util').save_conjugation

let post_verb_conjugation = async function (name) {

    if (await is_conjugation_in_database(name)) {
        throw Error
    }

    let conjugation = await get_conjugation(name)

    await save_conjugation(conjugation)

    return conjugation
}

// POST / - Add a new verb providing nameUTF8 and name
router.post('/', apiAuth.checkJwt, (req, res) => {

    let name = req.body.name

    post_verb_conjugation(name)
        .then((data) => {

            res.status(200).json(data)
        })
        .catch((e) => {

            console.log("Error in Verb Conjugation POST")
            console.log(e)
            res.status(404).json("Error")
        })
});

module.exports = {router, post_verb_conjugation};