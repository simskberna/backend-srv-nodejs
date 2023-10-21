const express = require('express');
var bodyParser = require('body-parser')
const userController = require('../controllers/userController');

const router = express.Router();
const jsonParser = bodyParser.json()


router.post('/',jsonParser, (req, res) => {
    userController.handleNewUser(req,res)
});
module.exports = router