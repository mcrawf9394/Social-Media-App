var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({msg: "hello"})
});

// User Routes
router.get('/users', userController.getUsers)
router.post('/users', userController.addUser)
router.get('/users/auth', userController.auth)
router.post('/users/login', userController.loginUser)
router.get('/users/:userId', userController.getSingleUser)
router.put('/users', userController.updateUser)
router.delete('/users/:userId', userController.deleteUser)
router.get('/users/following', userController.getSomeUsers)
// Post Routes

module.exports = router;
