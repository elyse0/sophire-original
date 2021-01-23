const express = require('express');
const router = express.Router();

const Verb = require('/models/verb');

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

module.exports = router;