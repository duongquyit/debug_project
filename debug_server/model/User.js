const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
};

const User = new Schema({
    name: { type: String, require: true, trim: true },
    username: { type: String, require: true, minLength: 6, trim: true, unique: true },
    password: { type: String, require: true, minLength: 6, trim: true },
    email: { type: String, require: true, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    gender: { type: String, require: true, trim: true },
    avatar: { type: String, trim: true, default: 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png' },
    isAdmin: { type: Boolean, default: false, },
    isActive: { type: Boolean, default: true, },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
}, schemaOptions)

module.exports = mongoose.model('User', User);
