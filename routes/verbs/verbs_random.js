const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser')

// Import models
const Verb = require('/models/verb');
const CookieVerb = require('/models/cookieVerb')

// Import util functions
let random = require('/util/random_integer')

// GET /random - Get a random verb using cookies to ensure see all the verbs
router.get('/', function(req, res) {

    // Print Cookie value
    console.log("Cookie: ")
    console.log(cookieParser.JSONCookies(req.cookies))

    // Get cookieVerbsID from Cookie
    let randomNumber;
    let cookieVerbsID;

    try{
        cookieVerbsID = cookieParser.JSONCookies(req.cookies)['FrenchVerbs'].verbsID
    }catch (e){
        cookieVerbsID = undefined
    }

    // Validate if cookie is still valid
    CookieVerb.findById(cookieVerbsID).exec(function (err, dataCookie) {

        if(err){
            res.status(500).json({mensaje: "Error getting cookie info"})
        }
        // If cookie hasn't been set-up or non-valid
        else if(dataCookie === null){

            Verb.find({}).sort({nameUTF8: 1}).exec(function (err, data) {

                if (err)
                    res.status(500).json({mensaje: "Error getting verb list - Cookie!"})
                else {
                    // Generate new random number from all possible verbs
                    randomNumber = random.forceRandomInteger(0, data.length - 1)

                    // Create a new cookie
                    let cookie = CookieVerb({
                            verbs: [data[randomNumber]._id]
                        }
                    )
                    // Save new cookie and get it's info in cookieData
                    cookie.save((err, cookieData) => {
                        if (err)
                            res.status(404).json({message: "Can't save verbs cookie!"})
                        else {
                            console.log("Cookie saved")
                            console.log(cookieData)

                            // Return selected image and new cookie ID
                            res.cookie('FrenchVerbs', {verbsID: cookieData._id}, {sameSite: 'strict'})
                            res.render('random', {
                                image: data[randomNumber],
                                path: "/verbs/random",
                                color: "is-primary"
                            });
                        }
                    })
                }
            });
        }
        // If user has a valid cookie
        else {
            // Get all verbs except those already seen (dataCookie.verbs is an array)
            Verb.find({'_id': {$nin: dataCookie.verbs} }).sort({nameUTF8: 1}).exec(function (err, data) {

                if(err)
                    res.status(500).json({mensaje: "More than two!!"})
                else{
                    console.log("Verbs left for " + cookieVerbsID +": " + data.length)

                    if(data.length === 0){
                        CookieVerb.findByIdAndDelete(cookieVerbsID, (error, cookieData) => {

                            if(error)
                                res.status(404).json({mensaje:"Error al borrar"});
                            else{
                                console.log("Cookie deleted")
                                res.redirect('/verbs/random');
                            }
                        })
                    }else{
                        // Generate random number from possible verbs
                        randomNumber = random.forceRandomInteger(0, data.length - 1)

                        // Get ID from verb and add it to the user's cookie
                        let newDataCookie = (dataCookie.verbs).concat(data[randomNumber]._id)

                        // Update user's cookie using his cookieVerbsID and adding the updated array
                        CookieVerb.findByIdAndUpdate(cookieVerbsID,
                            {'verbs': newDataCookie }, {new: true, timestamps: false}, function(error,cookieData){
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
                            path: "/verbs/random",
                            color: "is-primary"
                        });
                    }
                }
            });
        }
    });
});


module.exports = router;