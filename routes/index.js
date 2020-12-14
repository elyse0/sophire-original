var express = require('express');
var router = express.Router();
var axios = require('axios');
var lodash = require('lodash')
var cookieParser = require('cookie-parser')

const Random = require("random-js");
const random = new Random.Random();


const Verb = require('../models/verb');

let isEmpty = function (obj){
    return Object.keys(obj).length === 0;
}

let getKeysFromJson = function (json){

    try{
        return Object.keys(json)
    }
    catch (error){
        return []
    }
}

let forceRandomInteger = function (limInf, limSup){

    let randomValue = undefined

    while (randomValue === undefined){
        randomValue = random.integer(limInf, limSup)
    }

    return randomValue
}

let arrayToJsonKeys = function (array){

    jsonArray = {}

    for(let i = 0; i < array.length; i++){

        jsonArray[array[i]]
    }
}

function setDifference(a, b){

    return new Set(
        [...a].filter(x => !b.has(x)))
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

    randomNumber = 0
    console.log(cookieParser.JSONCookies(req.cookies))

    try{
        keysFromCookie = cookieParser.JSONCookies(req.cookies)['CookieVerbs']['verbs']
    }
    catch (error){
        keysFromCookie = []
    }

    console.log("Cookies length: " + keysFromCookie.length)
    Verb.find({}).sort({nameUTF8: 1}).exec(function (err, data) {

        if(err)
            res.status(500).json({mensaje: "error!"})
        else{
            // Cookies
            if(keysFromCookie.length === 0 || keysFromCookie.length === data.length){
                // New cookie and first verb

                randomNumber = forceRandomInteger(0, data.length)
                tempCookie = {'verbs': [randomNumber]}
                res.cookie('CookieVerbs', tempCookie, {sameSite: 'strict'})
            }else {
                // Create a set with all possible verbs
                let allVerbs = new Set([...Array(data.length).keys()])
                // Create a set from cookie
                let verbsUser = new Set(cookieParser.JSONCookies(req.cookies)['CookieVerbs']['verbs'])
                // Create a set from all available verbs
                let possibleVerbs = setDifference(allVerbs, verbsUser)

                // Choose random number of the avaiable verbs's set
                let arrayPossibleVerbs = Array.from(possibleVerbs)
                randomNumber = arrayPossibleVerbs[forceRandomInteger(0, arrayPossibleVerbs.length)]
                console.log("Random number: " + randomNumber)

                console.log("Number of verbs left: " + (arrayPossibleVerbs.length))

                // Add random number to the cookie
                tempCookie = cookieParser.JSONCookies(req.cookies)['CookieVerbs']
                tempCookie['verbs'].push(randomNumber)
                res.cookie('CookieVerbs', tempCookie,{sameSite: 'strict'})
            }

            //console.log(allVerbs)
            res.render('random', {verb: data[randomNumber]});
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

    function json2set(json){
        var result = new Set();
        var keys = Object.keys(json);

        keys.forEach(function(key){
            result.add(json[key].imageURL);
        });
        return result;
    }

    function arraytojson(array){

        var arrayToString = JSON.stringify(Object.assign({}, array));  // convert array to string
        var stringToJsonObject = JSON.parse(arrayToString);  // convert string to json object

        return stringToJsonObject
    }

    axios.get("https://api.github.com/repos/kolverar/french_verbs/contents/public/images")
        .then(response =>{

            // Github Repo
            githubRepo = response.data.map(function(item){
                return {
                    "imageURL": item.download_url
                }
            })

            githubSet = json2set(githubRepo)

            // Local API
            Verb.find({},{'_id': false,'imageURL': true}).sort({nameUTF8: 1}).exec(function (err, data) {

                if(err)
                    res.status(500).json({mensaje: "error!"})
                else{
                    //console.log(data)

                    //console.log(Object.values(data['imageURL']))
                    localSet = json2set(data)

                    jsonDifference = arraytojson(Array.from(setDifference(githubSet, localSet)))

                    res.status(200).json(jsonDifference)
                }
            });

            }
        )
        .catch(error => {
            console.log(error)
            res.status(200).json(error)
        })


})

module.exports = router;
