const Posts = require('../models/posts')
const Users = require('../models/user')
const Comments = require('../models/comments')
const {validationResult, body} = require('express-validator')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const uuid = require('uuid').v4
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: 'dcubikbtn',
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})
const asyncHandler = require('express-async-handler')
const fs = require('node:fs')
exports.addPost = [
    passport.authenticate('jwt', {session: false}),
    body('content')
        .trim()
        .isLength({min: 1})
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(200).json({errors: errors.array()})
        } else {
            let userId = jwt.decode(req.headers.authorization.split(' ')[1]).id
            try {
                const user = await Users.findById(userId)
                const newPost = new Posts ({
                    userId: userId,
                    user: user.username,
                    userPhoto: user.profilePic,
                    content: req.body.content,
                    likes: [],
                    date: new Date()
                })
                await newPost.save()
                res.status(200).json({post: newPost._id})
            } catch {
                res.status(500).json({errors: [{msg: "There was an error reaching the database"}]})
            }
        }
    })
]
exports.getAllPosts = asyncHandler(async (req, res, next) => {
    try {
        const posts = await Posts.find().sort({date: -1})
        res.status(200).json({posts: posts})
    } catch {
        res.status(500).json({errors:[{msg: 'There was an issue reaching the database'}]})
    }
})
exports.getSomePosts = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        const userId = jwt.decode(req.headers.authorization.split(' ')[1]).id;
        try {
            const currentUser = await Users.findById(userId)
            let arr = []
            const createObj = (id) => {
                return {
                    userId: id
                }
            }
            for (i = 0; i < currentUser.following.length; i++) {
                arr.push(createObj(currentUser.following[i]));
            }
            arr.push(createObj(userId))
            const posts = await Posts.find({$or : arr}).sort({date: -1})
            res.status(200).json({posts: posts})
        } catch {
            res.status(500).json({errors:[{msg: 'There was an issue reaching the database'}]})
        }
    })
]
exports.getSinglePost = asyncHandler(async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.postId)
        let isUser = false
        let isLiked = false
        const currentUser = await Users.findById(jwt.decode(req.headers.authorization.split(' ')[1]).id)
        if (currentUser.username === post.user) {
            isUser = true
        }
        if (post.likes.indexOf(jwt.decode(req.headers.authorization.split(' ')[1]).id) != -1) {
            isLiked = true
        }
        if (currentUser.username === "Sam C.") {
            isUser = true
        }
        const comments = await Comments.find({post: req.params.postId}).sort({date: -1}).exec()
        res.status(200).json({post: post, comments: comments, username: currentUser.username, canEdit: isUser, isLiked: isLiked})
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
exports.updatePostPicture = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        const picId = uuid()
        try {
            const request = await cloudinary.uploader.upload(req.files[0].path, {public_id: picId})
            fs.unlink(req.files[0].path, (err) => {
                if (err) {console.log(err)}
                else console.log("file deleted")
            })
            if (request.url) {
                await Posts.findByIdAndUpdate(req.params.postId, {photo: request.url})
                res.status(200).json({success: "The post's picture has been updated"})
            } else {
                res.status(500).json({errors: [{msg: "There was an error uploading the image"}]})
             }
        } catch (error) {
            console.log(error)
            res.status(200).json({errors: [{msg: 'There was an error uploading the image'}]})
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