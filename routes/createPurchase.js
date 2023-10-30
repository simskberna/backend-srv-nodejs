const express = require('express');
var bodyParser = require('body-parser')
const userController = require('../controllers/userController');

const router = express.Router();
const jsonParser = bodyParser.json()


router.post('/:id', jsonParser, (req, res) => {    
    userController.handlePurchase(req, res)
});
module.exports = router 