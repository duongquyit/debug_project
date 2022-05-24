const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const schemaOptions = {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
};

const Course = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imgThumbnail: { type: String, required: true, trim: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    slug: { type: String, slug: 'name', unique: true },
    outstandingMark: { type: Number, default: 0 },
    tag: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    courseParts: [{ type: Schema.Types.ObjectId, ref: 'CoursePart' }],
}, schemaOptions);

module.exports = mongoose.model('Course', Course);