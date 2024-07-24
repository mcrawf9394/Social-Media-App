const Posts = require('../models/posts')
const Users = require('../models/user')
const Comments = require('../models/comments')
const {validationResult, body} = require('express-validator')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const asyncHandler = require('express-async-handler')
exports.getAllPosts = asyncHandler(async (req, res, next) => {
    try {
        const posts = await Posts.find().sort({date: 1})
        res.status(200).json({posts: posts})
    } catch {
        res.status(500).json({errors:[{msg: 'There was an issue reaching the database'}]})
    }
})
exports.getSinglePost = asyncHandler(async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.postId)
        let isUser = false
        let isLiked = false
        if (req.headers.authorization) {
            const currentUser = await Users.findById(jwt.decode(req.headers.authorization.split(' ')[1]).id)
            if (currentUser.username === post.user) {
                isUser = true
            }
            if (post.likes.indexOf(jwt.decode(req.headers.authorization.split(' ')[1]).id) != -1) {
                isLiked = true
            }
        }
        const comments = await Comments.find({post: req.params.postId}).sort({date: -1}).exec()
        res.status(200).json({post: post, comments: comments, canEdit: isUser, isLiked: isLiked})
    } catch (err) {
        console.log(err)
        res.status(500).json({errors:[{msg: 'There was an issue reaching the database'}]})
    }
})
exports.deletePost = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        try {
            await Posts.findByIdAndDelete(req.params.postId)
            await Comments.deleteMany({post: req.params.postId})
            res.status(200).json({success: 'The post and comments for the post have been deleted'})
        } catch {
            res.status(500).json({errors:[{msg: 'There was an issue reaching the database'}]})
        }
    })
]
exports.updatePost = [
    passport.authenticate('jwt', {session: false}),
    body('content'),
    body('photo'),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(200).json({errors: errors.array()})
        } else {
            try {
                
            } catch {
                res.status(500).json({errors:[{msg: 'There was an issue reaching the database'}]})
            }
        }
    })
]
exports.likePost = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        try {
            const userId = jwt.decode(req.headers.authorization.split(' ')[1]).id
            const currentPost = await Posts.findById(req.params.postId)
            let post
            if (currentPost.likes.indexOf(userId) === -1) {
                post = await Posts.findByIdAndUpdate(req.params.postId, {$push: {likes: userId}})
            } else {
                post = await Posts.findByIdAndUpdate(req.params.postId, {$pull: {likes: userId}})
            }
            res.status(200).json({post: post})
        } catch {
            res.status(500).json([{msg: 'There has been an issue reaching the server'}])
        }
    })
]