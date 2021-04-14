const mongoose = require('mongoose')
const Schema = mongoose.Schema

let verb_conjugation = Schema({
        id: mongoose.Types.ObjectId,
        verb: {
            infinitive: {type: String},
            predicted: {type: Boolean},
            pred_score: {type: Number},
            template: {type: String},
            translation_en: {type: String},
            stem: {type: String}
        },
        moods: {
            infinitif: {
                infinitif_present: {type: [String]}
            },
            indicatif: {
                present: {type: [String]},
                imparfait: {type: [String]},
                futur_simple: {type: [String]},
                passe_simple: {type: [String]},
                passe_compose: {type: [String]},
                plus_que_parfait: {type: [String]},
                futur_anterieur: {type: [String]},
                passe_anterieur: {type: [String]}
            },
            conditionnel: {
                present: {type: [String]},
                passe: {type: [String]}
            },
            subjonctif: {
                present: {type: [String]},
                imparfait: {type: [String]},
                passe: {type: [String]},
                plus_que_parfait: {type: [String]}
            },
            imperatif: {
                imperatif_present: {type: [String]},
                imperatif_passe: {type: [String]}
            },
            participe: {
                participe_present: {type: [String]},
                participe_passe: {type: [String]}
            }
        }
    },
    {
        versionKey: false
    }
    )
;

module.exports = mongoose.model("VerbConjugation", verb_conjugation)
