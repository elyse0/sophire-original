const express = require('express');
const router = express.Router();
const axios = require('axios');
const apiAuth = require('/util/auth_api')
const cdn = require('/util/cdn')

const Verb = require('/models/verb');

const CDN = cdn.URL + "/verbs/"

// POST / - Add a new verb providing nameUTF8 and name
router.post('/', apiAuth.checkJwt , (req, res) => {

    nameUTF8 = req.body.nameUTF8

    // Check if verb exists
    Verb.find({'nameUTF8': nameUTF8}, (error, data) => {

        // It doesnt exist duplicate
        if(data.length === 0){

            // Check if image exists
            console.log(CDN + nameUTF8 + ".png")
            axios.get(CDN + nameUTF8 + ".png")
                .then((response) => {

                    let verb = Verb({
                            name: req.body.name,
                            nameUTF8: nameUTF8,
                            imageURL: CDN + nameUTF8 + ".png"
                        }
                    )

                    verb.save((err, data) => {

                        if(err)
                            res.status(404).json({message: "Can't save it!"})
                        else
                            res.status(201).json(data)
                    })
                })
                .catch((err) => {

                    res.status(404).json({message: "Can't find image!"})
                })
        }
        else {
            console.log(data)
            res.status(404).json({message: "Verb already exists!"})
        }
    })
});

module.exports = router;