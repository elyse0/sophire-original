const express = require('express');
const router = express.Router();

let getJsonIndexes = require('/util/verbs_indexes').getJsonIndexes

const Verb = require('/models/verb');

// Get /verbs - Get list of verbs by index
router.get('/', function(req, res) {

    let index = req.query.index
    let indexes = 'abcdefghijklmnopqrstuvwxyz'.split('').concat(["all"])
    let jsonIndexes = getJsonIndexes(indexes)

    // If index  is undefined, show verbs starting with A
    if(index === undefined)
        index = 'a'

    if(indexes.includes(index)){

        if(index === "all"){

            Verb.find().sort({nameUTF8: 1}).exec(function (err, data) {

                if(err)
                    res.render('404')
                else
                    res.render('verbs', {
                        title: 'Suffire | Verbes et vocabulaire française',
                        title_content: "All verbs",
                        verbs: data,
                        indexes: jsonIndexes});
            })
        }
        else{

            Verb.find({nameUTF8: { '$regex': "^" + index}}).sort({nameUTF8: 1}).exec(function (err, data) {

                if(err)
                    res.render('404')
                else
                    res.render('verbs', {
                        title: 'Suffire | Verbes et vocabulaire française',
                        title_content: 'Verbes commençant par ' + index.toUpperCase(),
                        verbs: data,
                        indexes: jsonIndexes});
            })
        }
    }
    else
        res.render('404')
});

module.exports = router;
