const CoursePart = require('../model/CoursePart');
const Lesson = require('../model/Lesson');

class CoursePartController {

    // [GET] /:id
    async getCoursePartById(req, res) {
        const id = req.params.id;
        try {
            const part = await CoursePart.findById(id);
            return res.status(200).json(part);
        } catch (error) {
            return res.status(400).json({ title: 'can not get part', error: error });
        }
    }

    // [GET] /
    async getCourseParts(req, res, next) {
        try {
            const courseParts = await CoursePart.find({});
            return res.status(200).json(courseParts);
        } catch (error) {
            return res.status(403).json({ title: 'can not get course parts', error: error });
        }
    }

    //[GET] /:coursePartId/lesson/
    async getLessonsByCoursePartId(req, res) {
        const coursePartId = req.params.coursePartId;
        try {
            const lessons = await Lesson.find({ coursePartId: coursePartId });
            res.status(200).json(lessons);
        } catch (error) {
            res.status(403).json({ title: 'can not find lesson by course part id' });
        }
    }

    // [POST] /:coursePartId/lesson
    async addLesson(req, res) {
        try {
            const coursePartId = req.params.coursePartId;
            const { name, videoId } = req.body;
            if (!name) {
                return res.status(400).json({ title: 'Lesson name is not empty' });
            }
            const lesson = new Lesson({
                name: name,
                coursePartId: coursePartId,
                videoId: videoId,
            });
            const coursePart = await CoursePart.findById(coursePartId);
            coursePart.lessons.push(lesson);
            await lesson.save();
            await coursePart.save();
            return res.status(200).json(lesson);
        } catch (error) {
            return res.status(200).json({ title: 'can not add lesson', message: error.message });
        }
    }

    // [DELETE] /:coursePartId/:lessonId/delete
    async deleteLesson(req, res, next) {
        try {
            const coursePartId = req.params.coursePartId;
            const lessonId = req.params.lessonId;
            const coursePart = await CoursePart.findById(coursePartId);
            const lessonIdIndex = coursePart.lessons.indexOf(lessonId);
            coursePart.lessons.splice(lessonIdIndex, 1);
            await coursePart.save();
            await Lesson.findByIdAndDelete(lessonId);
            return res.status(200).json({ title: 'lesson deleted' });
        } catch (error) {
            return res.status(500).json({ title: 'lesson can not delete', message: error.message });
        }
    }

    // [PATCH] /:coursePartId/:lessonId/update
    async updateLesson(req, res) {
        try {
            const lessonId = req.params.lessonId;
            const { name, videoId } = req.body;
            await Lesson.findByIdAndUpdate(lessonId, { name: name, videoId: videoId });
            const lesson = await Lesson.findById(lessonId);
            return res.status(200).json(lesson);
        } catch (error) {
            return res.status(500).json({ title: 'can not update lesson', message: error.message });
        }
    }

};

module.exports = new CoursePartController();