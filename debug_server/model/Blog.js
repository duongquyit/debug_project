const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const schemaOptions = {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
};

const Blog = new Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    metaDescription: { type: String, trim: true },
    imageThumbnail: { type: String, trim: true },
    reactions: [{ type: String }],
    tag: [{ type: String }],
    outstandingMark: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    slug: { type: String, slug: 'title', unique: true },
}, schemaOptions)

module.exports = mongoose.model('Blog', Blog);