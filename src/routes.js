const express = require('express');
const router = express.Router();
const Controller = require('./controller');
const verifyToken = require('./verify_token');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

router.post('/auth/register', Controller.register);
router.post('/auth/login', Controller.login);
router.get('/user/details', verifyToken, Controller.getUserDetails);
router.post('/plants/add', verifyToken, upload.single('photo'), Controller.addPlant);
router.get('/plants', verifyToken, Controller.getUserProducts);
router.get('/user/reminders', verifyToken, Controller.getReminders);
router.get('/user/allremainders', verifyToken, Controller.getAllRemainders)





module.exports = router;