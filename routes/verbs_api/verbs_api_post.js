const express = require('express');
const router = express.Router();
const axios = require('axios');

// Util
const apiAuth = require('/util/auth_api')
const cdn = require('/util/urls').cdn
let normalization = require('/util/normalization')
let post_verb_conjugation = require('/routes/verb_conjugation_api/verb_conjugation_post').post_verb_conjugation

const Verb = require('/models/verb');

const CDN = cdn + "/verbs/"

// POST / - Add a new verb providing nameUTF8 and name
router.post('/', apiAuth.checkJwt , (req, res) => {

    let name = req.body.name
    let nameUTF8 = normalization.getNormalizedName(req.body.name)

    // Check if verb exists
    Verb.find({'nameUTF8': nameUTF8}, (error, data) => {

        // It doesnt exist duplicate
        if(data.length === 0){

            // Check if image exists
            console.log(CDN + nameUTF8 + ".png")
            axios.get(CDN + nameUTF8 + ".png")
                .then((response) => {

                    let verb = Verb({
                            name: name,
                            nameUTF8: nameUTF8,
                            imageURL: CDN + nameUTF8 + ".png"
                        }
                    )

                    // Save new verb conjugation
                    post_verb_conjugation(name)
                        .then((data) => {

                            // Save new verb
                            verb.save((err, data) => {

                                if(err)
                                    return res.status(404).json({message: "Can't save it!"})

                                return res.status(201).json(data)
                            })
                        })
                })
                .catch((err) => {

                    console.log(err)
                    return res.status(404).json("Error")
                })
        }
        else {
            console.log(data)
            return res.status(404).json({message: "Verb already exists!"})
        }
    })
});

module.exports = router;