var express = require('express');
import {login, register} from "../controllers/user.js";
var router = express.Router();

/* GET users listing. */
router.post('/login', login);
router.post('/register', register);


module.exports = router;
