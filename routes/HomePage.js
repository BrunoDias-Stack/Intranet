var express = require('express');
var router = express.Router();

const HomePage = require("../controllers/HomePage")

router.get('/', HomePage.index)

module.exports = router;