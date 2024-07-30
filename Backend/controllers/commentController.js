const Comments = require('../models/comments')
const User = require('../models/user')
const {validationResult, body} = require('express-validator')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const asyncHandler = require('express-async-handler')
exports.getPostComments = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req,res,next) => {
        try {
            const comments = await Comments.find({post: req.body.post}).sort({date: -1}).exec()
            res.status(200).json({comments: comments})
        } catch {
            res.status(500).json({errors: [{msg: 'There was an issue reaching the database'}]})
        }
    })
]
exports.addComment = [
    passport.authenticate('jwt', {session: false}),
    body('content')
        .trim()
        .isLength({min: 1})
        .escape(),
    asyncHandler(async (req,res,next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(200).json({errors: errors.array()})
        } else {
            const userId = jwt.decode(req.headers.authorization.split(' ')[1]).id
            try {
                const currentUser = await User.findById(userId)
                const comment = new Comments({
                    content: req.body.content,
                    date: new Date(),
                    userName: currentUser.username,
                    userPhoto: currentUser.profilePic,
                    likes: [],
                    post: req.body.post
                })
                await comment.save()
                res.status(200).json({comment: comment})
            } catch {
                res.status(500).json({errors: [{msg: 'There was an issue reaching the database'}]})
            }
        }
    })
]
exports.updateComment = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req,res,next) => {
        try {
            
        } catch {
            res.status(500).json({errors: [{msg: 'There was an issue reaching the database'}]})
        }
    })
]
exports.deleteComment = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req,res,next) => {
        try {
            await Comments.findByIdAndDelete(req.params.commentId)
            res.status(200).json({success: "This comment was deleted successfully"})
        } catch {
            res.status(500).json({errors: [{msg: 'There was an issue reaching the database'}]})
        }
    })
]