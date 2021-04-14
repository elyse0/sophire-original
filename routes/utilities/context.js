let express = require('express');
let router = express.Router();
const axios = require('axios');

let Verb = require('/models/verb')

router.get('/', (req, res) => {

    let params

    Verb.find({}).sort({'nameUTF8': 1}).exec((err, data) => {

        if(err)
            return res.status(404).json("Error")

        let interval = setInterval(gen => {
            const { value, done } = gen.next()

            if (done) {
                clearInterval(interval)
            } else {

                params = new URLSearchParams()
                params.append('name', value.name)

                axios.post("http://localhost:3000/api/conjugaison_verbe/", params, {headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                })
                    .then(response => {
                        console.log("POST " + value.name)
                    })
                    .catch(error => {
                        console.log("ERROR " + value.name)
                    })
            }
        }, 1000, data[Symbol.iterator]())


    })
})

module.exports = router
//
// var express = require('express');
// var router = express.Router();
// const Reverso = require('reverso-api');
//
// const reverso = new Reverso();
//
// // Schemas from Mongoose
// const Verb = require('/models/verb');
// const CookieVerb = require('/models/cookieVerb');
//
// router.get('/', (req, res) =>{
//
//     console.log("Got it")
//
//     reverso.getContext('hope', 'english', "spanish").then(response => {
//         console.log(response)
//         res.status(200).json(response)
//     }).catch(err => {
//         console.log(err)
//         res.status(500).json({message: "Error!"})
//     });
// })
//
// module.exports = router;