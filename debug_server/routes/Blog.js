const express = require('express');
const router = express.Router();
const blogController = require('../controller/BlogController');
const authToken = require('../middleware/authServer');

router.get('/', blogController.getBlogs);
router.get('/my-blog', authToken, blogController.getMyBlogs);
router.get('/:id/reactions', authToken, blogController.getBlogReaction);
router.get('/:slug', blogController.getBlogBySlug);
router.post('/', authToken, blogController.createBlog);
router.post('/:id/reactions', authToken, blogController.setBlogReaction);
router.patch('/:id/update', authToken, blogController.updateBlog);
router.delete('/:id/delete', authToken, blogController.delelteBlog);
// comment
router.get('/:id/comment', blogController.getComments);
router.post('/:id/comment', authToken, blogController.addComment);
router.delete('/:blogId/:commentId/delete', authToken, blogController.deleteComment);
router.patch('/:blogId/:commentId/update', authToken, blogController.updateComment);


module.exports = router;