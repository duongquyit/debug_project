const express = require('express');
const router = express.Router();
const coursePartController = require('../controller/CoursePartController');
const authToken = require('../middleware/authServer'); 
const isAdmin = require('../middleware/confirmAdmin');

router.get('/:id', coursePartController.getCoursePartById);
router.get('/', coursePartController.getCourseParts);
router.get('/:coursePartId/lesson', coursePartController.getLessonsByCoursePartId);
router.post('/:coursePartId/lesson', authToken, isAdmin, coursePartController.addLesson);
router.delete('/:coursePartId/:lessonId/delete', authToken, isAdmin, coursePartController.deleteLesson);
router.patch('/:coursePartId/:lessonId/update', authToken, isAdmin, coursePartController.updateLesson);

module.exports = router;