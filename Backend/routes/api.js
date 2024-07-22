var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const postController = require('../controllers/postsController')

// User Routes
router.get('/users', userController.getUsers)
router.post('/users', userController.addUser)
router.get('/users/auth', userController.auth)
router.post('/users/login', userController.loginUser)
router.put('/users/follow/:userId', userController.followUser)
router.put('/users/unfollow/:userId', userController.unfollowUser)
router.get('/users/following', userController.getFollowing)
router.get('/users/followed', userController.getFollowed)
router.get('/users/:userId', userController.getSingleUser)
router.put('/users/:userId', userController.updateUser)
router.delete('/users/:userId', userController.deleteUser)
router.put('/users/:userId/picture', userController.updateUserPicture)
// Post Routes
router.get('/posts', postController.getAllPosts)
router.get('/posts/:postId', postController.getSinglePost)


module.exports = router;
