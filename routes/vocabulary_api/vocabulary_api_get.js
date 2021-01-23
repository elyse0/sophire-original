const express = require('express');
const router = express.Router();

const Vocabulary = require('/models/vocabulary');

// GET / - Get entire database of vocabulary
router.get('/', (req, res) => {

    Vocabulary.find({}).sort({nameUTF8: 1}).exec(function (err, data) {

        if(err)
            res.status(500).json({mensaje: "error!"})
        else
            res.status(200).json(data)
    });
});

// GET /:nameUTF8 - Get a vocabulary by nameUTF8
router.get('/:nameUTF8',(req,res)=>{

    Vocabulary.findOne({'nameUTF8' : req.params.nameUTF8},(err,data)=>{

        if( data == null)
            res.status(404).json({mensaje:"It doesn't exist!"});
        else
            res.status(200).json(data);
    });
});

module.exports = router;