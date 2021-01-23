var express = require('express');
var router = express.Router();

const verbsIndex = require('/routes/verbs/verbs_index')
const verbsRandom = require('/routes/verbs/verbs_random')

router.use('/', verbsIndex)
router.use('/random', verbsRandom)

module.exports = router;