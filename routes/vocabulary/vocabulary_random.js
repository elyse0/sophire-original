const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser')

// Import models
const Vocabulary = require('/models/vocabulary')
const CookieVocabulary = require('/models/cookieVocabulary')

// Import util functions
let random = require('/util/random_integer')

// Get a random vocabulary image
router.get('/', function(req, res) {

    // Print Cookie value
    console.log("Cookie vocabulary: ")
    console.log(cookieParser.JSONCookies(req.cookies))

    // Get cookieVocabularyID from Cookie
    let randomNumber;
    let cookieVocabularyID;

    try{
        cookieVocabularyID = cookieParser.JSONCookies(req.cookies)['FrenchVerbs'].vocabularyID
    }catch (e){
        cookieVocabularyID = undefined
    }

    // Validate if cookie is still valid
    CookieVocabulary.findById(cookieVocabularyID).exec(function (err, dataCookie) {

        if(err){
            res.status(500).json({mensaje: "Error getting cookie info"})
        }
        // If cookie hasn't been set-up or non-valid
        else if(dataCookie === null){

            Vocabulary.find({}).sort({nameUTF8: 1}).exec(function (err, data) {

                if (err)
                    res.status(500).json({mensaje: "Error getting vocabulary list - Cookie!"})
                else {
                    // Generate new random number from all possible vocabulary images
                    randomNumber = random.forceRandomInteger(0, data.length - 1)

                    // Create a new cookie
                    let cookie = CookieVocabulary({
                            vocabulary: [data[randomNumber]._id]
                        }
                    )
                    // Save new cookie and get it's info in cookieData
                    cookie.save((err, cookieData) => {
                        if (err)
                            res.status(404).json({message: "Can't save vocabulary cookie!"})
                        else {
                            console.log("Cookie vocabulary saved")
                            console.log(cookieData)

                            // Return selected image and new cookie ID
                            res.cookie('FrenchVerbs', {vocabularyID: cookieData._id}, {sameSite: 'strict'})
                            res.render('random', {
                                image: data[randomNumber],
                                path: "/vocabulary/random",
                                color: "is-info"
                            });
                        }
                    })
                }
            });
        }
        // If user has a valid cookie
        else {
            // Get all vocabulary images except those already seen (dataCookie.vocabulary is an array)
            Vocabulary.find({'_id': {$nin: dataCookie.vocabulary} }).sort({nameUTF8: 1}).exec(function (err, data) {

                if(err)
                    res.status(500).json({mensaje: "More than two!!"})
                else{
                    console.log("Vocabulary images left for " + cookieVocabularyID +": " + data.length)

                    if(data.length === 0){
                        CookieVocabulary.findByIdAndDelete(cookieVocabularyID, (error, cookieData) => {

                            if(error)
                                res.status(404).json({mensaje:"Error al borrar"});
                            else{
                                console.log("Cookie deleted")
                                res.redirect('/vocabulary/random');
                            }
                        })
                    }else{
                        // Generate random number from possible vocabulary images
                        randomNumber = random.forceRandomInteger(0, data.length - 1)

                        // Get ID from vocabulary image and add it to the user's cookie
                        let newDataCookie = (dataCookie.vocabulary).concat(data[randomNumber]._id)

                        // Update user's cookie using his cookieVocabularyID and adding the updated array
                        CookieVocabulary.findByIdAndUpdate(cookieVocabularyID,
                            {'vocabulary': newDataCookie }, {new: true, timestamps: false}, function(error,cookieData){
                                if (error) {
                                    res.status(404).json({mensaje:"Error al guardar"});
                                }else{
                                    console.log("Cookie Updated")
                                    //console.log(cookieData)
                                }
                            });

                        // Return selected image
                        res.render('random', {
                            image: data[randomNumber],
                            path: "/vocabulary/random",
                            color: "is-info"
                        });
                    }
                }
            });
        }
    });
});

module.exports = router;