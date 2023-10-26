const express = require('express');
var bodyParser = require('body-parser')
const userController = require('../controllers/userController');

const router = express.Router();
const jsonParser = bodyParser.json()


router.get('/:id', jsonParser, (req, res) => {     
    userController.handleDisplayingCart(req, res)
});
module.exports = router 