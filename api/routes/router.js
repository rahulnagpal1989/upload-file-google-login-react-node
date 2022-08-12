const express = require('express');
const app = express();
const router = express.Router();
const {homePage, signupPage, dashboardPage, loginRequired, validateToken, uploadFile, getFiles} = require('../controllers/controller');

router.post('/signup', signupPage);
router.get('/dashboard', loginRequired, dashboardPage);
router.post('/validateToken', validateToken);
router.post('/uploadFile', loginRequired, uploadFile);
router.post('/getFiles', loginRequired, getFiles);
router.get('/', homePage);

module.exports = router;