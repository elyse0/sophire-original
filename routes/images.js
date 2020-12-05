const express = require('express');
const router = express.Router();
const axios = require('axios');

const Verb = require('../models/verb');
const CDN = "https://raw.githubusercontent.com/kolverar/french_verbs/master/public/images/"

// CORS
router.use((req, res, next) => {

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

// API REST  /verbs/*

router.get('/', (req, res) => {

    Verb.find({}).sort({name: 1}).exec(function (err, data) {

        if(err)
            res.status(500).json({mensaje: "error!"})
        else
            res.status(200).json(data)
    });
});

router.get('/:nameUTF8',(req,res)=>{

    Verb.findOne({'nameUTF8' : req.params.nameUTF8},(err,data)=>{

        if( data == null)
            res.status(404).json({mensaje:"It doesn't exist!"});
        else
            res.status(200).json(data);
    });
});

router.delete('/',(req,res)=>{

    res.status(405).json({mensaje:"Not allowed"});
});

router.delete('/:nameUTF8' , (req,res)=>{

    Verb.findOneAndDelete({id: req.body.nameUTF8} , (err, datos)=>{

        if(err)
            res.status(404).json({mensaje:"Couldn't find it"});
        else
            res.status(200).json({mensaje: "Ok"})

    });
});

router.post('/', (req, res) => {

    nameUTF8 = req.body.nameUTF8

    // Check if verb exists
    Verb.find({'nameUTF8': nameUTF8}, (error, data) => {

        // It doesnt exist duplicate
        if(data.length === 0){

            // Check if image exists
            console.log(CDN + nameUTF8 + ".png")
            axios.get(CDN + nameUTF8 + ".png")
                .then((response) => {

                    let verb = Verb({
                            name: req.body.name,
                            nameUTF8: nameUTF8,
                            imageURL: CDN + nameUTF8 + ".png"
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
            console.log(data)
            res.status(404).json({message: "Verb already exists!"})
        }
    })
});


router.patch('/', (req, res) => {

    nameUTF8 = req.body.nameUTF8

    // Check if verb exists
    Verb.findOne({'nameUTF8': nameUTF8}, (error, data) => {

        // It exists
        if(data.length !== 0){

            // Check if image exists
            axios.get(CDN + nameUTF8 + ".png")
                .then((response) => {

                    let verb = Verb({
                            name: req.body.name,
                            nameUTF8: nameUTF8,
                            imageURL: CDN + nameUTF8 + ".png"
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
            console.log(data)
            res.status(404).json({message: "Verb doesn't exist!"})
        }
    })
});



module.exports = router;