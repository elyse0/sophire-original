const express = require('express');
const router = express.Router();
const axios = require('axios');

// Util
const apiAuth = require('/util/auth_api')
const cdn = require('/util/urls').cdn
let normalization = require('/util/normalization')

const Vocabulary = require('/models/vocabulary');
const CDN = cdn + "/vocabulary/"

// PATCH / - Update verb info providing nameUTF8 and new name
router.patch('/', apiAuth.checkJwt, (req, res) => {

    let nameUTF8 = req.body.nameUTF8

    // Check if verb exists
    Vocabulary.findOne({'nameUTF8': nameUTF8}, (error, data) => {

        // It exists
        if(data.length !== 0){

            // Check if image exists
            axios.get(CDN + nameUTF8 + ".png")
                .then((response) => {

                    let verb = Vocabulary({
                            name: req.body.name,
                            nameUTF8: nameUTF8,
                            imageURL: CDN + nameUTF8 + ".png",
                            category: req.body.category,
                            categoryUTF8: req.body.categoryUTF8
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
            res.status(404).json({message: "Vocabulary image doesn't exist!"})
        }
    })
});

module.exports = router;