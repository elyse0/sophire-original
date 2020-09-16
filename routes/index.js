var express = require('express');
var router = express.Router();

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
            res.render('random', {verb: data[Math.floor(Math.random() * (data.length))]});
    });
});

router.get('/verbs', function(req, res) {

    Verb.find({}, (err, data) => {

        if(err)
            res.status(500).json({mensaje: "error!"})
        else
            res.render('verbs', {verbs: data});
    });
});


router.get('/admin', function(req, res) {

    res.render('admin');
});


router.get('/api', function(req, res) {

    res.render('api');
});

router.post('/search', function(req, res) {

    Verb.find({name: {'$regex': req.body.search}}, (err, data) => {

        if(err)
            res.status(404).json({message: "Error!"})
        else {
            res.render('search', {verbs: data})
            console.log(data)
        }
    })
});

module.exports = router;
