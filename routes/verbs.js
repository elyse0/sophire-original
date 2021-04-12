var express = require('express');
var router = express.Router();

const verbsIndex = require('/routes/verbs/verbs_index')
const verbsRandom = require('/routes/verbs/verbs_random')
const verbsInfo = require('/routes/verbs/verbs_info')

router.use('/', verbsIndex)
router.use('/aleatoire', verbsRandom)
router.use('/', verbsInfo)

module.exports = router;