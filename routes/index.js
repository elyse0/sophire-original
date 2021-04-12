var express = require('express');
var router = express.Router();

const mainpage = require('/routes/utilities/mainpage')
const api = require('/routes/utilities/api')
const search = require('/routes/utilities/search')
const admin = require('/routes/utilities/admin')
const verbs_todo = require('/routes/utilities/verbs_todo')
const vocabulary_todo = require('/routes/utilities/vocabulary_todo')
const context = require('/routes/utilities/context')

router.use('/', mainpage)
router.use('/api', api)
router.use('/search', search)
router.use('/admin', admin)
router.use('/verbes_a_faire', verbs_todo)
router.use('/vocabulaire_a_faire', vocabulary_todo)
router.use('/context', context)

module.exports = router;
