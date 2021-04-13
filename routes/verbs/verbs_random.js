const express = require('express');
const router = express.Router();

// Import models
const Verb = require('/models/verb');
const CookieVerb = require('/models/cookieVerb')

// Import util functions
let random = require('/util/random_integer')
let cookie_util = require('/util/cookies')

// GET /random - Get a random verb using cookies to ensure see all the verbs
router.get('/', function(req, res) {

    // Print cookie value
    cookie_util.print_cookies(req.cookies)

    // Get cookies
    let verbsID = cookie_util.get_verbsID_from_cookie(req.cookies)
    let vocabularyID = cookie_util.get_vocabularyID_from_cookie(req.cookies)

    let random_number
    let selected_verb

    // Validate if cookie is still valid
    CookieVerb.findById(verbsID).exec(function (err, cookie_data) {

        if(!err) {

            // Couldn't find verbsID, so we need to create a new one
            if(cookie_data === null){

                // Select a random verb
                Verb.find({}).sort({nameUTF8: 1}).exec(function (err, data) {

                    if (!err){

                        // Generate new random number from all possible verbs
                        random_number = random.forceRandomInteger(0, data.length - 1)

                        // Selected verb
                        selected_verb = data[random_number]

                        // Create a new cookie
                        let cookie = CookieVerb({
                                verbs: [selected_verb._id]
                            }
                        )

                        // Save new cookie
                        cookie.save((err, saved_cookie_data) => {

                            if (err)
                                res.status(404).json({message: "Can't save verbsID!"})
                            else {
                                console.log("New verbsID created: ")
                                console.log(saved_cookie_data)

                                // Return selected image_id and new cookie ID
                                res.cookie('FrenchVerbs',
                                    {verbsID: saved_cookie_data._id, vocabularyID: vocabularyID},
                                    {sameSite: 'strict'})

                                res.render('random_verb', {
                                    image: selected_verb,
                                    path: "/verbes/aleatoire",
                                    color: "is-primary"
                                });
                            }
                        })
                    }
                });
            }
            // User still has a valid cookie
            else {
                // Get all verbs except those already seen (cookie_data.verbs is an array)
                Verb.find({'_id': {$nin: cookie_data.verbs} }).sort({nameUTF8: 1}).exec(function (err, verbs_data) {

                    if(err)
                        res.status(500).json({mensaje: "Error consulting left verbs"})
                    else{
                        console.log("Verbs left for " + verbsID +": " + verbs_data.length)

                        if(verbs_data.length === 0){
                            CookieVerb.findByIdAndDelete(verbsID, (error, deleted_cookie_data) => {

                                if(error)
                                    res.status(404).json({mensaje:"Error deleting cookie"});
                                else{
                                    console.log("Cookie deleted")
                                    res.redirect('/verbes/aleatoire');
                                }
                            })
                        }else{
                            // Generate random number from possible verbs
                            random_number = random.forceRandomInteger(0, verbs_data.length - 1)

                            // Select verb
                            selected_verb = verbs_data[random_number]

                            // Get ID from the new selected verb and add it to the user's cookie
                            let updated_cookie_data = (cookie_data.verbs).concat(selected_verb._id)

                            // Update user's cookie array, using his verbsID
                            CookieVerb.findByIdAndUpdate(verbsID,
                                {'verbs': updated_cookie_data },
                                {new: true, timestamps: false},
                                function (error,cookieData){

                                if (error) {
                                        res.status(404).json({mensaje:"Error saving verbsID"});
                                    }else{
                                        console.log("VerbsID updated")
                                        //console.log(cookieData)
                                    }
                                });

                            // Return selected image
                            res.render('random_verb', {
                                image: selected_verb,
                                path: "/verbes/aleatoire",
                                color: "is-primary"
                            });
                        }
                    }
                });
            }
        }
    });
});


module.exports = router;