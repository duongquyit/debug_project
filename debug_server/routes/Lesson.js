const express = require('express');
const router = express.Router();
const lessonControler = require('../controller/LessonController');

router.get('/:id', lessonControler.getLessonById);

module.exports = router;