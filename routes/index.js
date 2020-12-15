var express = require('express');
var router = express.Router();
var axios = require('axios');
var cookieParser = require('cookie-parser')
const randomInt = require('random-int');

// Schemas from Mongoose
const Verb = require('../models/verb');
const CookieVerb = require('../models/cookieVerb');

// Force random integer - Warning: both limits are taken into account!
let forceRandomInteger = function (limInf, limSup){

    randomNumber = undefined

    while (randomNumber === undefined){
        randomNumber = randomInt(limInf, limSup);
    }

    console.log("Random number: " + randomNumber)
    return randomNumber
}

function setDifference(a, b){

    return new Set(
        [...a].filter(x => !b.has(x)))
}

function arrayToJson(array){

    var arrayToString = JSON.stringify(Object.assign({}, array));  // convert array to string
    // convert string to json object
    return JSON.parse(arrayToString)
}
/* GET home page. */

// GET / - Get mainpage of French verbs
router.get('/', function(req, res) {

    Verb.find({}, (err, data) => {

        if(err)
            res.status(500).json({mensaje: "error!"})
        else
            res.render('index', { title: 'Suffire | French verbs', verbs: data});
    });
});

// GET /random - Get a random verb using cookies to ensure see all the verbs
router.get('/random', function(req, res) {

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
                    randomNumber = forceRandomInteger(0, data.length - 1)

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
                            res.render('random', {verb: data[randomNumber]});
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
                                res.redirect('back')
                            }
                        })
                    }else{
                        // Generate random number from possible verbs
                        randomNumber = forceRandomInteger(0, data.length - 1)

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
                        res.render('random', {verb: data[randomNumber]});
                    }
                }
            });
        }
    });
});

// Get /verbs - Get list of verbs by index --> default: all
router.get('/verbs', function(req, res) {

    index = req.query.index

    indexes = 'abcdefghijklmnopqrstuvwxyz'.split('').concat(["all"])

    arrayTemp = []

    for(let i = 0; i < indexes.length; i++){
        jsonTemp = {}
        jsonTemp['index'] = indexes[i]
        arrayTemp.push(jsonTemp)
    }

    jsonIndexes = JSON.parse(JSON.stringify(arrayTemp))


    if(indexes.includes(index)){

        if(index === "all"){
            Verb.find().sort({nameUTF8: 1}).exec(function (err, data) {

                if(err)
                    res.status(404).json({message: "error"})
                else
                    res.render('verbs', {title: 'Suffire | French verbs', verbs: data, indexes: jsonIndexes});
            })
        }
        else{

            Verb.find({nameUTF8: { '$regex': "^" + index}}).sort({nameUTF8: 1}).exec(function (err, data) {

                if(err)
                    res.status(404).json({message: "error"})
                else
                    res.render('verbs', {title: 'Suffire | French verbs', verbs: data, indexes: jsonIndexes});
            })
        }
    }
    else if(index === undefined){
        Verb.find({nameUTF8: { '$regex': "^a"}}).sort({nameUTF8: 1}).exec(function (err, data) {

            if(err)
                res.status(404).json({message: "error"})
            else
                res.render('verbs', {title: 'Suffire | French verbs', verbs: data, indexes: jsonIndexes});
        })
    }
    else
        res.status(404).json({message: "error"})
});

// GET /admin - Get admin login access
router.get('/admin', function(req, res) {

    res.render('admin');
});

// GET /api - Show REST API table
router.get('/api', function(req, res) {

    res.render('api');
});

// GET /search - Search entire verb database using nameUTF8
router.post('/search', function(req, res) {

    // Get rid of accents or weird stuff
    let search = (req.body.search).normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    Verb.find({nameUTF8: {'$regex': search }}).sort({nameUTF8: 1}).exec((err, data) => {

        if(err)
            res.status(404).json({message: "Error!"})
        else {
            res.render('search', {verbs: data})
            console.log(data)
        }
    })
});

// GET /todo  - Get list of verbs left to add to database
router.get('/todo', function (req, res) {

    axios.get("https://api.github.com/repos/kolverar/french_verbs/contents/public/images")
        .then(response =>{

                // Github Repo Set
                githubRepoSet = new Set(response.data.map((item) => item.download_url))

                // Local API
                Verb.find({},{'_id': false,'imageURL': true}).sort({nameUTF8: 1}).exec(function (err, data) {

                    if(err)
                        res.status(500).json({mensaje: "error!"})
                    else{
                        // Create array of imageURLs and convert it to a Set
                        dbVerbsSet = new Set(data.map((item) => item.imageURL))

                        // Get difference between githubRepoSet and dbVerbsSet and convert it to JSON
                        jsonDifference = arrayToJson(Array.from(setDifference(githubRepoSet, dbVerbsSet)))

                        res.status(200).json(jsonDifference)
                    }
                });

            }
        )
        .catch(error => {
            res.status(200).json({message: "Can't get info from repo!"})
        })
})

module.exports = router;
