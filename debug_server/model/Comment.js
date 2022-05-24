const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
};

const Comment = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Blog' },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    commentContent: { type: String, require: true, trim: true },
}, schemaOptions);

module.exports = mongoose.model('Comment', Comment);