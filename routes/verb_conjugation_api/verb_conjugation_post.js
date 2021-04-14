const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');

// Util
const apiAuth = require('/util/auth_api')

const verb_conjugation = require('/models/verb_conjugation');

// POST / - Add a new verb providing nameUTF8 and name
router.post('/', (req, res) => {

    let name = req.body.name

    // Check if verb exists
    verb_conjugation.find({'moods.infinitif.infinitif_present': name}, (error, data) => {

        if(error)
            return res.status(404).json("Error on Verb Conjugation POST")

        if(data.length)
            return res.status(404).json("Error on Verb Conjugation POST - Conjugation already exists")

        // Use local docker instance of bretttolbert/verbecc-svc
        // FIXME: Deploy docker image on a remote server (Heroku failed because of project size)
        axios.get("http://localhost:8000/conjugate/fr/" + encodeURIComponent(name))
            .then((response) => {

                let conjugation = response.data.value

                let verb_conjugation_data = verb_conjugation({

                    verb: conjugation.verb,
                    moods: {
                        infinitif: {
                            infinitif_present: conjugation.moods['infinitif']['infinitif-présent']
                        },
                        indicatif: {
                            present: conjugation.moods['indicatif']['présent'],
                            imparfait: conjugation.moods['indicatif']['imparfait'],
                            futur_simple: conjugation.moods['indicatif']['futur-simple'],
                            passe_simple: conjugation.moods['indicatif']['passé-simple'],
                            passe_compose: conjugation.moods['indicatif']['passé-composé'],
                            plus_que_parfait: conjugation.moods['indicatif']['plus-que-parfait'],
                            futur_anterieur: conjugation.moods['indicatif']['futur-antérieur'],
                            passe_anterieur: conjugation.moods['indicatif']['passé-antérieur']
                        },
                        conditionnel: {
                            present: conjugation.moods['conditionnel']['présent'],
                            passe: conjugation.moods['conditionnel']['passé']
                        },
                        subjonctif: {
                            present: conjugation.moods['subjonctif']['présent'],
                            imparfait: conjugation.moods['subjonctif']['imparfait'],
                            passe: conjugation.moods['subjonctif']['passé'],
                            plus_que_parfait: conjugation.moods['subjonctif']['plus-que-parfait']
                        },
                        imperatif: {
                            imperatif_present: conjugation.moods['imperatif']['imperatif-présent'],
                            imperatif_passe: conjugation.moods['imperatif']['imperatif-passé']
                        },
                        participe: {
                            participe_present: conjugation.moods['participe']['participe-présent'],
                            participe_passe: conjugation.moods['participe']['participe-passé']
                        }
                    }
                })

                verb_conjugation_data.save((err, data) => {

                    if(err)
                        return res.status(404).json({message: "Can't save conjugation"})

                    return res.status(201).json(data)
                })
            })
            .catch((err) => {
                console.log(err)

                return res.status(404).json({message: "Error on Verb Conjugation POST - Can't get API"})
            })
    })
});

module.exports = router;