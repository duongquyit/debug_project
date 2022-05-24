const Blog = require('../model/Blog');
const User = require('../model/User');
const Comment = require('../model/Comment');

class BlogController {

    // [GET] /
    async getBlogs(req, res) {
        try {
            const blogs = await Blog.find({})
                .populate({ path: 'author', select: ['name', 'username', 'email', 'avatar'] })
            return res.status(200).json(blogs);
        } catch (error) {
            return res.status(403).json({ title: error.message });
        }
    }

    // [POST] /
    async createBlog(req, res) {
        const { title, content, imgThumbnail, tag } = req.body;
        const authorId = req.payload.id;
        if (!title) {
            return res.status(403).json({ title: 'Title is required' });
        }
        if (content.length == 0) {
            return res.status(403).json({ title: 'Content is required' });

        }
        const position = content.search('/');
        const metaDescription = content.substring(0, position + 3);
        const blog = new Blog({
            title: title,
            content: content,
            metaDescription: metaDescription,
            imageThumbnail: imgThumbnail,
            tag: tag,
            author: authorId,
        });
        try {
            const user = await User.findById(authorId);
            user.blogs.push(blog);
            await blog.save();
            await user.save();
        } catch (error) {
            return res.status(403).json({ title: 'can not create blog' });
        }
        return res.status(200).json(blog);
    }

    // [GET] /my-blog
    async getMyBlogs(req, res) {
        const userId = req.payload.id;
        try {
            const user = await User.findById(userId)
                .populate({ path: 'blogs' });
            return res.status(200).json(user.blogs);
        } catch (error) {
            res.status(403).json({ title: `can not get blog of user ${user.username}` })
        }
    }

    // find by id or authorId
    // [GET] /:id 
    async getBlogById(req, res) {
        try {
            const blog = await Blog.findOne({ _id: req.params.id });
            const blogByAuthorId = await Blog.find({ authorId: req.params.id });
            if (blog) {
                return res.status(200).json({ blog });
            } else if (blogByAuthorId) {
                return res.status(200).json({ blogByAuthorId });
            }
        } catch (error) {
            return res.status(500).json({ title: 'Blog not exists!' });
        }
    }

    // [GET] /:slug
    async getBlogBySlug(req, res) {
        try {
            const blogBySlug = await Blog.findOne({ slug: req.params.slug })
                .populate({ path: 'author', select: ['name', 'username', 'email', 'gender, isAdmin', 'avatar'] })
            if (blogBySlug) {
                ++blogBySlug.outstandingMark;
                await blogBySlug.save();
                return res.status(200).json(blogBySlug);
            }
            const blogById = await Blog.findById(req.params.slug)
                .populate({ path: 'author', select: ['name', 'username', 'email', 'gender, isAdmin', 'avatar'] })
            ++blogById.outStandingMark;
            blogById.save();
            return res.status(200).json(blogById);
        } catch (error) {
            return res.status(500).json({ title: 'Blog can not found' });
        }
    }

    // [DELETE] /:id/delete
    async delelteBlog(req, res) {
        const userId = req.payload.id;
        try {
            const blog = await Blog.findById(req.params.id);
            if (blog.author.toString() == userId || req.payload.isAdmin) {
                try {
                    const user = await User.findById(blog.author);
                    const index = user.blogs.findIndex(blogId => blogId.toString() == blog._id.toString());
                    user.blogs.splice(index, 1);
                    await user.save();
                    await Blog.findByIdAndDelete(req.params.id);
                    await Comment.deleteMany({ postId: req.params.id })
                    return res.status(200).json({ title: 'blog deleted!' });
                } catch (error) {
                    return res.status(500).json({ title: 'can not delete blog' });
                }
            } else {
                return res.status(404).json({ title: 'user not invalid' });
            }
        } catch (error) {
            return res.status(500).json({ title: 'error deleting blog' });
        }

    }

    // [PATCH] /:id/update
    async updateBlog(req, res) {
        const userId = req.payload.id;
        try {
            const blog = await Blog.findById(req.params.id);
            if (blog.author.toString() != userId) {
                return res.status(404).json({ title: 'User is invalid' });
            }
            try {
                const blog = {
                    title: req.body.title,
                    content: req.body.content,
                    tag: req.body.tag,
                };
                await Blog.updateOne({ _id: req.params.id }, blog);
                const blogAfterUpdate = await Blog.findById(req.params.id);
                res.status(200).json(blogAfterUpdate);
            } catch (error) {
                res.status(500).json({ title: 'update failed 1' });
            }
        } catch (error) {
            res.status(500).json({ title: 'update failed 2' });
        }
    }

    // [POST] /:id/reactions
    async setBlogReaction(req, res) {
        const userId = req.payload.id;
        let reactionStatus = false;
        try {
            const user = await User.findById(userId);
            const blog = await Blog.findById(req.params.id);
            if (!blog.reactions.includes(user.username)) {
                blog.reactions.push(user.username);
                reactionStatus = true;
                await blog.save();
            } else {
                const index = blog.reactions.indexOf(user.username);
                blog.reactions.splice(index, 1);
                reactionStatus = false;
                await blog.save();
            }
            return res.status(200).json({ reactionStatus, userId })
        } catch (error) {
            return res.status(401).json({ title: 'Can not reaction' })
        }
    }

    // [GET] /:id/reactions
    async getBlogReaction(req, res) {
        const userId = req.payload.id;
        try {
            const blog = await Blog.findById(req.params.id);
            const user = await User.findById(userId);
            if (!blog.reactions.includes(user.username)) {
                return res.status(200).json({ reactionStatus: false, userId: userId });
            } else {
                return res.status(200).json({ reactionStatus: true, userId: userId });
            }
        } catch (error) {
            return res.status(400).json({ title: 'Can not reaction', message: error.message })
        }
    }

    // COMMENT ----------------------------------------------------
    // [GET] :id/comment
    async getComments(req, res) {
        const id = req.params.id;
        try {
            const comments = await Comment.find({ postId: id })
                .populate({ path: "authorId", select: ['name', 'username', 'email', 'gender', 'avatar'] });
            return res.status(200).json(comments);
        } catch (error) {
            return res.status(500).json({ title: 'Can not get comments' })
        }
    }

    // [POST] /:id/comment
    async addComment(req, res, next) {
        const id = req.params.id;
        const { commentContent } = req.body;
        const userId = req.payload.id;
        try {
            if (!commentContent) {
                return res.status(403).json({ title: 'comment is empty' });
            } else {
                const comment = new Comment({
                    postId: id,
                    commentContent: commentContent,
                    authorId: userId
                });
                const blogRelated = await Blog.findById(id);
                blogRelated.comments.push(comment);
                await comment.save();
                await blogRelated.save();
                const commentCreate = await Comment.findById(comment._id)
                    .populate({
                        path: 'authorId',
                        select: ['name', 'username', 'email', 'gender, isAdmin', 'avatar']
                    });
                res.status(200).json(commentCreate);
            }
        } catch (error) {
            res.status(403).json({ title: 'can not add comment' });
        }
    }

    // [DELETE] /:blogId/:commentId/delete
    async deleteComment(req, res) {
        const userIsAdmin = req.payload.isAdmin;
        try {
            const userId = req.payload.id;
            const comment = await Comment.findById(req.params.commentId);
            if (userIsAdmin || comment.authorId.toString() === userId) {
                try {
                    const blog = await Blog.findById(req.params.blogId);
                    const commentIndex = blog.comments.indexOf(comment._id);
                    blog.comments.splice(commentIndex, 1);
                    await Comment.deleteOne({ _id: req.params.commentId });
                    await blog.save();
                    res.status(200).json({ title: 'Delete successfully' });
                } catch (error) {
                    res.status(500).json({ title: 'Can not delete comment' });
                }
            } else {
                res.status(404).json({ title: 'User invalid!' })
            }

        } catch (error) {
            console.log(error);
        }
    }

    // [PATCH] /:blogId/:commentId/update
    async updateComment(req, res) {
        const userId = req.payload.id;
        const isAdmin = req.payload.isAdmin;
        try {
            const comment = await Comment.findById(req.params.commentId);
            if (isAdmin || comment.authorId.toString() == userId) {
                try {
                    await Comment.updateOne({ _id: req.params.commentId }, { commentContent: req.body.commentContent })
                    const commentAfterUpdate = await Comment.findById(comment._id)
                        .populate({
                            path: 'authorId',
                            select: ['name', 'username', 'email', 'gender, isAdmin', 'avatar']
                        });
                    return res.status(200).json(commentAfterUpdate);
                } catch (error) {
                    return res.status(401).json({ title: 'can not update comment' })
                }
            } else {
                return res.status(403).send({ title: 'user is invalid' });
            }
        } catch (error) {
            return res.status(500).send({ title: 'comment can not found' });
        }
    }
}

module.exports = new BlogController;
