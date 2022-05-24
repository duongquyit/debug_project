const express = require('express');
const router = express.Router();
const courseController = require('../controller/CourseController');
const authToken = require('../middleware/authServer');
const confirmAdmin = require('../middleware/confirmAdmin');

router.get('/', courseController.getCourses);
router.post('/', authToken, confirmAdmin, courseController.createCourse);
router.get('/my-course', authToken, confirmAdmin, courseController.getMyCourse);
router.get('/:slug', courseController.getCourseBySlug);
router.delete('/:id/delete', authToken, confirmAdmin, courseController.deleteCourse);
router.patch('/:id/update', authToken, confirmAdmin, courseController.updateCourse);

// course-part
router.post('/:courseId/course-part', authToken, confirmAdmin, courseController.addCoursePart);
router.get('/:courseId/course-part', courseController.getCourseParts);
router.delete('/:courseId/:coursePartId/delete', authToken, confirmAdmin, courseController.deleteCoursePart);
router.patch('/:courseId/:coursePartId/update', authToken, confirmAdmin, courseController.updateCoursePart);

module.exports = router;
