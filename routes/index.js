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
            res.render('random', {message: "{{message}}"})
    });
});



module.exports = router;
