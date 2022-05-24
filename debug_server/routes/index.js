
const userRoute = require('./User');
const blogRoute = require('./Blog');
const courseRoute = require('./Course');
const coursePartRoute = require('./CoursePart')
const lessonRoute = require('./Lesson');

const route = (app) => {
    app.use('/', userRoute);
    app.use('/blog', blogRoute);
    app.use('/course', courseRoute);
    app.use('/course-part', coursePartRoute);
    app.use('/lesson', lessonRoute);
}

module.exports = route;