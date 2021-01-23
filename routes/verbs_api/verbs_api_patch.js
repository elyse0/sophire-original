const express = require('express');
const router = express.Router();
const axios = require('axios');
const apiAuth = require('/util/auth_api')
const cdn = require('/util/cdn')

const Verb = require('/models/verb');

const CDN = cdn.URL + "/images/"

// PATCH / - Update verb info providing nameUTF8 and new name
router.patch('/', apiAuth.checkJwt, (req, res) => {

    nameUTF8 = req.body.nameUTF8

    // Check if verb exists
    Verb.findOne({'nameUTF8': nameUTF8}, (error, data) => {

        // It exists
        if(data.length !== 0){

            // Check if image exists
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
            res.status(404).json({message: "Verb doesn't exist!"})
        }
    })
});

module.exports = router;