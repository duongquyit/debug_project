const Lesson = require('../model/Lesson');

class LessonController {
    // [GET] /:id
    async getLessonById(req, res) {
        const id = req.params.id;
        try {
            const lesson = await Lesson.findById(id);
            res.status(200).json(lesson);
        } catch (error) {
            res.status(401).json(error);
        }
    }
}

module.exports = new LessonController;