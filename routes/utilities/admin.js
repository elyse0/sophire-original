var express = require('express');
var router = express.Router();

// GET /admin - Get admin login access
router.get('/', function(req, res) {

    res.render('admin');
});

module.exports = router;