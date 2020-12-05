var express = require('express');
var router = express.Router();
var axios = require('axios');
var lodash = require('lodash')

const { Random } = require("random-js");
const random = new Random();


const Verb = require('../models/verb');

/* GET home page. */
router.get('/', function(req, res) {

    Verb.find({}, (err, data) => {

        if(err)
            res.status(500).json({mensaje: "error!"})
        else
            res.render('index', { title: 'Suffire | French verbs', verbs: data});
    });
});

router.get('/random', function(req, res) {

    Verb.find({}, (err, data) => {

        if(err)
            res.status(500).json({mensaje: "error!"})
        else
            res.render('random', {verb: data[random.integer(0, data.length)]});
    });
});

router.get('/verbs', function(req, res) {

    index = req.query.index

    indexes = 'abcdefghijklmnopqrstuvwxyz'.split('').concat(["all"])
    console.log(indexes)

    indexes = [{"index": "amish"}, {"index": "sup"}]
    console.log(indexes)

    if(indexes.includes(index)){

        if(index === "all"){
            Verb.find().sort({nameUTF8: 1}).exec(function (err, data) {

                if(err)
                    res.status(404).json({message: "error"})
                else
                    res.render('verbs', {title: 'Suffire | French verbs', verbs: data, indexes: JSON.stringify(indexes)});
            })
        }
        else{

            Verb.find({name: { '$regex': "^" + index}}).sort({nameUTF8: 1}).exec(function (err, data) {

                if(err)
                    res.status(404).json({message: "error"})
                else
                    res.render('verbs', {title: 'Suffire | French verbs', verbs: data});
            })
        }
    }
    else if(index === undefined){
        Verb.find({name: { '$regex': "^a"}}).sort({nameUTF8: 1}).exec(function (err, data) {

            if(err)
                res.status(404).json({message: "error"})
            else
                res.render('verbs', {title: 'Suffire | French verbs', verbs: data});
        })
    }
    else
        res.status(404).json({message: "error"})
});


router.get('/admin', function(req, res) {

    res.render('admin');
});


router.get('/api', function(req, res) {

    res.render('api');
});

router.post('/search', function(req, res) {

    Verb.find({name: {'$regex': req.body.search}}).sort({nameUTF8: 1}).exec((err, data) => {

        if(err)
            res.status(404).json({message: "Error!"})
        else {
            res.render('search', {verbs: data})
            console.log(data)
        }
    })
});




router.get('/todo', function (req, res) {

    function json2set(json){
        var result = new Set();
        var keys = Object.keys(json);

        keys.forEach(function(key){
            result.add(json[key].imageURL);
        });
        return result;
    }

    function setDifference(a, b){

        let difference = new Set(
            [...a].filter(x => !b.has(x)));

        return difference
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
