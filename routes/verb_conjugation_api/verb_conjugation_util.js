const axios = require('axios');

// Util
let normalization = require('/util/normalization')
const conjugation_api = require('/util/urls').conjugation_api

// Models
const verb_conjugation = require('/models/verb_conjugation');

let is_conjugation_in_database = async function (infinitif_present) {

    let conjugation = await verb_conjugation.find({'moods.infinitif.infinitif_present': infinitif_present})

    console.log("Conjugations found: " + conjugation.length)

    if(conjugation.length){

        return true
    }

    return false
}

let get_conjugation = async function (verb) {

    let response = await axios.get(conjugation_api + "/conjugate/fr/" + encodeURIComponent(verb))

    return response.data.value
}

let save_conjugation = async function (conjugation) {

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

    let save = await verb_conjugation_data.save()
    console.log(save)
}


module.exports = {
    is_conjugation_in_database,
    get_conjugation,
    save_conjugation
}