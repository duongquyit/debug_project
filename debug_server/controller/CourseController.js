const Course = require('../model/Course');
const User = require('../model/User');
const CoursePart = require('../model/CoursePart');
const Lesson = require('../model/Lesson');

class CourseController {
    // [POST] /
    async createCourse(req, res) {
        const userId = req.payload.id;
        const { name, description, imgThumbnail, tag } = req.body;
        if (!name) {
            return res.status(403).json({ title: 'Course name is not empty' });
        }
        if (!description) {
            return res.status(403).json({ title: 'Description is not empty' });
        }
        if (!imgThumbnail) {
            return res.status(403).json({ title: 'Image thumbnail is not empty' });
        }
        const course = new Course({
            name: name,
            description: description,
            imgThumbnail: imgThumbnail,
            tag: tag,
            authorId: userId,
        });
        try {
            const user = await User.findById(userId);
            user.courses.push(course);
            await course.save();
            await user.save();
        } catch (error) {
            console.log(error);
        }
        return res.status(200).json(course);
    }

    // [GET] /
    async getCourses(req, res) {
        try {
            const courses = await Course.find({})
                .populate({ path: 'authorId', select: ['name', 'email', 'username', 'gender', 'avatar', 'phone'] });
            return res.status(200).json(courses);
        } catch (error) {
            return res.status(403).send({ title: 'No course' });
        }
    }

    // [GET] /my-course
    async getMyCourse(req, res) {
        const userId = req.payload.id;
        try {
            const user = await User.findById(userId)
                .populate({ path: 'courses' })
            return res.status(200).json(user.courses);
        } catch (error) {
            return res.status(500).json({ title: 'Can not get my course' });
        }
    }

    // [GET] /:slug
    async getCourseBySlug(req, res) {
        try {
            const courseSlug = await Course.findOne({ slug: req.params.slug })
                .populate({ path: 'courseParts', populate: { path: 'lessons' } })
            if (courseSlug) {
                courseSlug.outstandingMark += 1;
                await courseSlug.save();
                return res.status(200).json(courseSlug);
            } else {
                try {
                    const courseId = await Course.findOne({ _id: req.params.slug })
                        .populate({ path: 'courseParts', populate: { path: 'lessons' } })
                    if (courseId) {
                        ++courseId.outstandingMark;
                        await courseId.save();
                    }
                    return res.status(200).json(courseId);
                } catch (error) {
                    return res.status(403).json({ title: 'Course can not found' })
                }
            }
        } catch (error) {
            return res.status(403).json({ title: 'Course cant not found' })
        }

    }

    // [DELETE] /:id/delete
    async deleteCourse(req, res) {
        const userId = req.payload.id;
        const id = req.params.id;
        try {
            const user = await User.findById(userId)
            const course = await Course.findById(id)
                .populate({ path: 'courseParts' });
            // check current user must own this course
            if (course.authorId.toString() !== userId) {
                return res.status(404).json({ title: 'User is invalid' });
            } else {
                try {
                    // loop course part and delete every lesson have this partId
                    course.courseParts.forEach(async (item) => {
                        await Lesson.deleteMany({ coursePartId: item._id });
                    })
                    // find index of current course part then user own it will remove it
                    const index = user.courses.findIndex(courseId => courseId.toString() === id);
                    user.courses.splice(index, 1);
                    await user.save();
                    await Course.findByIdAndDelete(id);
                    // course part will automatic remove when course delete
                    await CoursePart.deleteMany({ courseId: id });
                    return res.status(200).json({ title: 'Deleted', course });
                } catch (error) {
                    return res.status(405).json({ title: 'Can not delete 1' });
                }
            }
        } catch (error) {
            res.status(500).json({ title: 'Can not delete 2' });
        }
    }

    // [PATCH] /:id/update
    async updateCourse(req, res) {
        const userId = req.payload.id;
        const id = req.params.id;
        try {
            const course = await Course.findById(id);
            if (course.authorId.toString() !== userId) {
                return res.status(404).json({ title: 'User is invalid' });
            } else {
                try {
                    const { name, description, imgThumbnail, tag } = req.body;
                    await Course.updateOne({ _id: id }, { name, description, imgThumbnail, tag });
                    const courseAfterUpdate = await Course.findById(id);
                    return res.status(200).json(courseAfterUpdate);
                } catch (error) {
                    return res.status(405).send({ title: 'Can not update' })
                }
            }
        } catch (error) {
            return res.status(401).json({ title: 'Error updating' })
        }


    }

    // COURSE PART ----------------------------------------------------
    // [POST] /:courseId/course-part
    async addCoursePart(req, res) {
        const courseId = req.params.courseId;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ title: 'Course part name is not empty' });
        } else {
            try {
                const course = await Course.findById(courseId)
                const coursePart = new CoursePart({ name, courseId });
                course.courseParts.push(coursePart);
                await course.save();
                await coursePart.save();
                return res.status(200).json(coursePart);
            } catch (error) {
                return res.status(500).json({ title: 'Can not add course part' });
            }
        }
    }

    // [GET] /:courseId/course-part
    async getCourseParts(req, res) {
        const courseId = req.params.courseId;
        try {
            const coursePart = await CoursePart.find({ courseId: courseId });
            res.status(200).json(coursePart);
        } catch (error) {
            res.status(401).json({ title: 'Can not get course part' });
        }
    }

    // [DELETE] /:courseId/:coursePartId/delete
    async deleteCoursePart(req, res) {
        const courseId = req.params.courseId;
        const coursePartId = req.params.coursePartId;
        try {
            const course = await Course.findById(courseId);
            const coursePartIndex = course.courseParts.indexOf(coursePartId);
            course.courseParts.splice(coursePartIndex, 1);
            await course.save();
            await CoursePart.findByIdAndDelete(coursePartId);
            await Lesson.deleteMany({ coursePartId: coursePartId });
            return res.status(200).json({ title: 'Course part is deleted' });
        } catch (error) {
            return res.status(200).json({ title: 'Course part can not delete' });
        }
    }

    // [DELETE] /:courseId/:coursePartId/update
    async updateCoursePart(req, res) {
        try {
            await CoursePart.findByIdAndUpdate(req.params.coursePartId, { name: req.body.name });
            return res.status(200).json({ title: 'Course part updated' });
        } catch (error) {
            return res.status(500).json({ title: 'Can not update course part' });
        }
    }

}

module.exports = new CourseController;