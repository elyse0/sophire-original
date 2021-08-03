const express = require('express');
const router = express.Router();
const ColorThief = require('colorthief');
const convert = require('color-convert');


// Util
const arrayToJson = require('/util/array_to_json').arrayToJson
const rgbToHex = require('/util/color').rgbToHex

const Verb = require('/models/verb')
const verb_conjugation = require('/models/verb_conjugation')

router.get('/:verbID', (req, res) => {

    let requestedVerb = req.params.verbID

    Verb.findOne({nameUTF8: requestedVerb}).sort({nameUTF8: 1}).exec((err, data) => {

        if (err)
            return res.render('404')

        if (data == null)
            return res.render('404')

        verb_conjugation.findOne({'moods.infinitif.infinitif_present': data.name}, (error, conjugation) => {

            if (error)
                return res.render('404')

            if (conjugation == null) {

                return res.render('verbs_info', {
                    title: "Verbe " + data.name.toUpperCase() + " - Sophire",
                    verb: data,
                    conjugation: conjugation,
                    index: data.nameUTF8.charAt(0)
                })
            }

            // // Get predominant color on image
            //
            // ColorThief.getColor(data.imageURL)
            //     .then((color) => {
            //
            //         let color_hex = rgbToHex(color)
            //
            //         console.log(convert.hex.keyword(color_hex))
            //
            //         console.log("Most used color")
            //         console.log(color)
            //
            //     })
            //     .catch((err) => {
            //         console.log(err)
            //
            //     })

            let c = {

                verb: conjugation.verb,
                moods: {
                    infinitif: {
                        infinitif_present: arrayToJson(conjugation.moods.infinitif.infinitif_present)
                    },
                    indicatif: {
                        present: arrayToJson(conjugation.moods.indicatif.present),
                        imparfait: arrayToJson(conjugation.moods.indicatif.imparfait),
                        futur_simple: arrayToJson(conjugation.moods.indicatif.futur_simple),
                        passe_simple: arrayToJson(conjugation.moods.indicatif.passe_simple),
                        passe_compose: arrayToJson(conjugation.moods.indicatif.passe_compose),
                        plus_que_parfait: arrayToJson(conjugation.moods.indicatif.plus_que_parfait),
                        futur_anterieur: arrayToJson(conjugation.moods.indicatif.futur_anterieur),
                        passe_anterieur: arrayToJson(conjugation.moods.indicatif.passe_anterieur)
                    },
                    conditionnel: {
                        present: arrayToJson(conjugation.moods.conditionnel.present),
                        passe: arrayToJson(conjugation.moods.conditionnel.passe)
                    },
                    subjonctif: {
                        present: arrayToJson(conjugation.moods.subjonctif.present),
                        imparfait: arrayToJson(conjugation.moods.subjonctif.imparfait),
                        passe: arrayToJson(conjugation.moods.subjonctif.passe),
                        plus_que_parfait: arrayToJson(conjugation.moods.subjonctif.plus_que_parfait)
                    },
                    imperatif: {
                        imperatif_present: arrayToJson(conjugation.moods.imperatif.imperatif_present),
                        imperatif_passe: arrayToJson(conjugation.moods.imperatif.imperatif_passe)
                    },
                    participe: {
                        participe_present: arrayToJson(conjugation.moods.participe.participe_present),
                        participe_passe: arrayToJson(conjugation.moods.participe.participe_passe)
                    }
                }
            }

            res.render('verbs_info', {
                title: "Verbe " + data.name.charAt(0).toUpperCase()  + data.name.slice(1) + " - Sophire",
                verb: data,
                conjugation: c,
                index: data.nameUTF8.charAt(0)
            })
        })
    })
})

module.exports = router