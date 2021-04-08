const express = require('express');
const router = express.Router();

// Import models
const Vocabulary = require('/models/vocabulary');
const CookieVocabulary = require('/models/cookieVocabulary')

// Import util functions
let random = require('/util/random_integer')
let cookie_util = require('/util/cookies')

// Get a random vocabulary image
router.get('/', function(req, res) {

    // Print cookie value
    cookie_util.print_cookies(req.cookies)

    // Get cookies
    let verbsID = cookie_util.get_verbsID_from_cookie(req.cookies)
    let vocabularyID = cookie_util.get_vocabularyID_from_cookie(req.cookies)

    let random_number
    let selected_vocabulary

    // Validate if cookie is still valid
    CookieVocabulary.findById(vocabularyID).exec(function (err, cookie_data) {

        if(!err) {

            // Couldn't find vocabularyID, so we need to create a new one
            if(cookie_data === null){

                // Select a random verb
                Vocabulary.find({}).sort({nameUTF8: 1}).exec(function (err, data) {

                    if (!err){

                        // Generate new random number from all possible vocabulary
                        random_number = random.forceRandomInteger(0, data.length - 1)

                        // Selected verb
                        selected_vocabulary = data[random_number]

                        // Create a new cookie
                        let cookie = CookieVocabulary({
                                vocabulary: [selected_vocabulary._id]
                            }
                        )

                        // Save new cookie
                        cookie.save((err, saved_cookie_data) => {

                            if (err)
                                res.status(404).json({message: "Can't save vocabularyID!"})
                            else {
                                console.log("New vocabularyID created: ")
                                console.log(saved_cookie_data)

                                // Return selected image_id and new cookie ID
                                res.cookie('FrenchVerbs',
                                    {verbsID: verbsID, vocabularyID: saved_cookie_data._id},
                                    {sameSite: 'strict'})

                                res.render('random', {
                                    image: selected_vocabulary,
                                    path: "/vocabulary/random",
                                    color: "is-info"
                                });
                            }
                        })
                    }
                });
            }
            // User still has a valid cookie
            else {
                // Get all vocabulary except those already seen (cookie_data.vocabulary is an array)
                Vocabulary.find({'_id': {$nin: cookie_data.vocabulary} }).sort({nameUTF8: 1}).exec(function (err, vocabulary_data) {

                    if(err)
                        res.status(500).json({mensaje: "Error consulting left vocabulary"})
                    else{
                        console.log("Vocabulary left for " + vocabularyID +": " + vocabulary_data.length)

                        if(vocabulary_data.length === 0){
                            CookieVocabulary.findByIdAndDelete(vocabularyID, (error, deleted_cookie_data) => {

                                if(error)
                                    res.status(404).json({mensaje:"Error deleting cookie"});
                                else{
                                    console.log("Cookie deleted")
                                    res.redirect('/vocabulary/random');
                                }
                            })
                        }else{
                            // Generate random number from possible vocabulary
                            random_number = random.forceRandomInteger(0, vocabulary_data.length - 1)

                            // Select verb
                            selected_vocabulary = vocabulary_data[random_number]

                            // Get ID from the new selected verb and add it to the user's cookie
                            let updated_cookie_data = (cookie_data.vocabulary).concat(selected_vocabulary._id)

                            // Update user's cookie array, using his vocabularyID
                            CookieVocabulary.findByIdAndUpdate(vocabularyID,
                                {'vocabulary': updated_cookie_data },
                                {new: true, timestamps: false},
                                function (error,cookieData){

                                    if (error) {
                                        res.status(404).json({mensaje:"Error saving vocabularyID"});
                                    }else{
                                        console.log("VocabularyID updated")
                                        //console.log(cookieData)
                                    }
                                });

                            // Return selected image
                            res.render('random', {
                                image: selected_vocabulary,
                                path: "/vocabulary/random",
                                color: "is-info"
                            });
                        }
                    }
                });
            }
        }
    });
});


module.exports = router;