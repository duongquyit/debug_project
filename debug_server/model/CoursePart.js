const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
};

const CoursePart = new Schema({
    name: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    isSelect: { type: Boolean, default: false },
}, schemaOptions);

module.exports = mongoose.model('CoursePart', CoursePart);