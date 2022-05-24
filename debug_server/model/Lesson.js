const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
};

const Lesson = new Schema({
    name: { type: String, required: true },
    coursePartId: { type: Schema.Types.ObjectId, ref: 'CoursePart' },
    videoId: { type: String, default: 'none' },
    isSelect: { type: Boolean, default: false },
}, schemaOptions);

module.exports = mongoose.model('Lesson', Lesson)