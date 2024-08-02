var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const postController = require('../controllers/postsController')
const commentController = require('../controllers/commentController')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/upload')
    },
    filename: function (res, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})

// User Routes
router.get('/users', userController.getUsers)
router.post('/users', userController.addUser)
router.get('/users/auth', userController.auth)
router.post('/users/login', userController.loginUser)
router.put('/users/follow/:userId', userController.followUser)
router.put('/users/unfollow/:userId', userController.unfollowUser)
router.get('/users/following', userController.getFollowing)
router.get('/users/followed', userController.getFollowed)
router.get('/users/isadmin', userController.isAdmin)
router.get('/users/:userId', userController.getSingleUser)
router.put('/users/:userId', userController.updateUser)
router.delete('/users/:userId', userController.deleteUser)
router.delete('/users/:userId/admin', userController.adminDeleteUser)
router.put('/users/:userId/picture', upload.array("img"), userController.updateUserPicture)
// Post Routes
router.get('/posts', postController.getAllPosts)
router.get('/posts/feed', postController.getSomePosts)
router.post('/posts', postController.addPost)
router.get('/posts/:postId', postController.getSinglePost)
router.delete('/posts/:postId', postController.deletePost)
router.put('/posts/:postId', postController.updatePost)
router.put('/posts/:postId/picture', upload.array("img"), postController.updatePostPicture)
router.put('/posts/:postId/like', postController.likePost)
// Comment Routes
router.put('/comments', commentController.getPostComments)
router.post('/comments', commentController.addComment)
router.put('/comments/:commentId', commentController.updateComment)
router.delete('/comments/:commentId', commentController.deleteComment)
router.put('/comments/:commentId/like', commentController.updateLikesComment)
module.exports = router;
