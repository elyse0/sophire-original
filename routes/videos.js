var express = require('express');
var router = express.Router();

const videos_index = require('/routes/videos/videos_index')
const videos_random = require('/routes/videos/videos_random')
const videos_channels = require('/routes/videos/videos_channels')

router.use('/', videos_index)
router.use('/aleatoire', videos_random)
router.use('/', videos_channels)

module.exports = router;
