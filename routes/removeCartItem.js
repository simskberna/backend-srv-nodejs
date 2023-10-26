const express = require('express');
var bodyParser = require('body-parser')
const userController = require('../controllers/userController');

const router = express.Router();
const jsonParser = bodyParser.json()


router.post('/:id/:productId', jsonParser, (req, res) => {    
    userController.handleCartItemDelete(req, res)
});
module.exports = router 