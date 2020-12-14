const express = require('express');
const router = express.Router();
const axios = require('axios');

// Authentication
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

// API Access Authentication using Auth0
const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://french-verbs.us.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'https://french-verbs.herokuapp.com/api',
    issuer: `https://french-verbs.us.auth0.com/`,
    algorithms: ['RS256']
});

const Verb = require('../models/verb');
const CDN = "https://raw.githubusercontent.com/kolverar/french_verbs/master/public/images/"

// REST API  /verbs/*

// GET / - Get entire database of verbs
router.get('/', (req, res) => {

    Verb.find({}).sort({nameUTF8: 1}).exec(function (err, data) {

        if(err)
            res.status(500).json({mensaje: "error!"})
        else
            res.status(200).json(data)
    });
});

// GET /:nameUTF8 - Get a verb by nameUTF8
router.get('/:nameUTF8',(req,res)=>{

    Verb.findOne({'nameUTF8' : req.params.nameUTF8},(err,data)=>{

        if( data == null)
            res.status(404).json({mensaje:"It doesn't exist!"});
        else
            res.status(200).json(data);
    });
});

// POST / - Add a new verb providing nameUTF8 and name
router.post('/',checkJwt , (req, res) => {

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

// PATCH / - Update verb info providing nameUTF8 and new name
router.patch('/',checkJwt, (req, res) => {

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

// DELETE /:nameUTF8 - Delete verb providing nameUTF8
router.delete('/:nameUTF8',checkJwt , (req,res)=>{

    Verb.findOneAndDelete({id: req.body.nameUTF8} , (err, datos)=>{

        if(err)
            res.status(404).json({mensaje:"Couldn't find it"});
        else
            res.status(200).json({mensaje: "Ok"})

    });
});

// DELETE / - Delete entire verb database <- Forbidden
router.delete('/',(req,res)=>{

    res.status(405).json({mensaje:"Not allowed"});
});

module.exports = router;