const express = require('express');
const router = express.Router();

const apiController = require('../controller/api.controller')();
const emailController = require('../controller/mail.controller')();

router.post('/order',apiController.Order);
router.get('/test-sendmail', emailController.SendMail);

module.exports = router;