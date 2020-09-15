const express = require('express');
const router = express.Router();
const axios = require('axios');

const Verb = require('../models/verb');
const CDN = "https://cdn.jsdelivr.net/gh/kolverar/french_verbs@master/public/images/"

// API REST

router.get('/', function(req, res) {

    res.render('index', { title: 'Express' });
});

router.get('/verbs/', (req, res) => {

    Verb.find({}, (err, data) => {

        if(err)
            res.status(500).json({mensaje: "error!"})
        else
            res.status(200).json(data)
    });
});

router.get('/verbs/:nameUTF8',(req,res)=>{

    Verb.findOne({'nameUTF8' : req.params.nameUTF8},(err,data)=>{

        if( data == null)
            res.status(404).json({mensaje:"It doesn't exist!"});
        else
            res.status(200).json(data);
    });
});

router.delete('/verbs',(req,res)=>{

    res.status(405).json({mensaje:"Not allowed"});
});

router.delete('/verbs/:nameUTF8' , (req,res,next)=>{

    Verb.findOneAndDelete({id: req.params.nameUTF8} , (err, datos)=>{

        if(err)
            res.status(404).json({mensaje:"Couldn't find it"});
        else
            res.status(200).json({mensaje: "Ok"})

    });
});

router.post('/verbs', (req, res) => {

    // Check if verb exists
    Verb.find({'nameUTF8': req.body.nameUT8}, (error, data) => {

        // It doesnt exist duplicate
        if(data == null){

            // Check if image exists
            axios.get(CDN + req.body.nameUTF8)
                .then((res) => {

                    let verb = Verb({
                            name: req.body.name,
                            nameUTF8: req.body.nameUTF8
                        }
                    )

                    verb.save((err, data) => {

                        if(err)
                            res.status(404).json({message: "Can't save it!"})
                        else
                            res.status(201).json(data)
                    })
                })
                .catch((err) => {

                    res.status(404).json({message: "Can't find image!"})
                })
        }
        else {

            res.status(404).json({message: "Verb already exists!"})
        }
    })
});

module.exports = router;