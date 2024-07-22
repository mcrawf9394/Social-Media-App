const Posts = require('../models/posts')
const Users = require('../models/user')
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
        const isUser = false
        if (req.headers.authorization) {
            const currentUser = await Users.findById(jwt.decode(req.headers.authorization.split(' ')[1]).id)
            if (currentUser.username === post.user) {
                isUser = true
            }
        }
        res.status(200).json({post: post, canEdit: isUser})
    } catch {
        res.status(500).json({errors:[{msg: 'There was an issue reaching the database'}]})
    }
})