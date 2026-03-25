const express = require('express');
const router = express.Router();

const apiController = require('../controller/api.controller')();
const emailController = require('../controller/mail.controller')();

router.post('/order',apiController.Order);
router.get('/feedback', apiController.FeedbackList);
router.get('/test-sendmail', emailController.SendMail);
router.post('/verify-turnstile', apiController.VerifyTurnstile);
module.exports = router;