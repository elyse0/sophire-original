var express = require('express');
var router = express.Router();

const videos_random = require('/routes/videos/videos_random')

router.use('/aleatoire', videos_random)

module.exports = router;
