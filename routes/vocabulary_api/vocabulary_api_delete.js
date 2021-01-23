const express = require('express');
const router = express.Router();
const apiAuth = require('/util/auth_api')

const Vocabulary = require('/models/vocabulary');

// DELETE /:nameUTF8 - Delete verb providing nameUTF8
router.delete('/:nameUTF8',apiAuth.checkJwt , (req,res)=>{

    Vocabulary.findOneAndDelete({id: req.body.nameUTF8} , (err, datos)=>{

        if(err)
            res.status(404).json({mensaje:"Couldn't find it"});
        else
            res.status(200).json({mensaje: "Deleted"})

    });
});

// DELETE / - Delete entire verb database <- Forbidden
router.delete('/',(req,res)=>{

    res.status(405).json({mensaje:"Not allowed"});
});

module.exports = router;