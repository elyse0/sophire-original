var express = require('express');
var router = express.Router();

const mainpage = require('/routes/utilities/mainpage')
const api = require('/routes/utilities/api')
const search = require('/routes/utilities/search')
const admin = require('/routes/utilities/admin')
const todo = require('/routes/utilities/todo')
const context = require('/routes/utilities/context')

router.use('/', mainpage)
router.use('/api', api)
router.use('/search', search)
router.use('/admin', admin)
router.use('/todo', todo)
router.use('/context', context)

module.exports = router;
