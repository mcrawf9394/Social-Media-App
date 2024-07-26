const asyncHandler = require('express-async-handler')
const {validationResult, body} = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config()
const cloudinary = require('cloudinary').v2
const uuid = require('uuid').v4
const fs = require('node:fs')
cloudinary.config({
    cloud_name: 'dcubikbtn',
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
exports.auth = [
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        let token = req.headers.authorization.split(' ')[1]
        let user = jwt.decode(token)
        res.status(200).json({id: user.id, msg: "Authorized"})
    }
]
exports.getUsers = [
    passport.authenticate('jwt', {session: false}), 
    asyncHandler (async (req, res, next) => {
        try {
            let token = req.headers.authorization.split(' ')[1]
            let user = jwt.decode(token)
            const users = await User.find({_id:{$not: {$eq: user.id}}}).sort({_id: 1})
            if (users.length === 0) {
                res.status(200).json({users: [{id: 1, username: 'No profiles', profilePic: '../../blank-profile-picture-973460_640.png'}]})
            } else {
                const arr = []
                for (i = 0; i < users.length; i++) {
                    const createNode = (profile) => {
                        return {
                            username: profile.username,
                            id: profile._id,
                            profilePic: profile.profilePic === '1' ? "../../blank-profile-picture-973460_640.png": profile.profilePic
                        }
                    }
                    arr.push(createNode(users[i]))
                }
                res.status(200).json({users: arr})
            }
        } catch {
            res.status(200).json({msg: "There was an error reaching the server"})
        }
    })
]
exports.getSingleUser = asyncHandler (async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            res.status(404)
        } else {
            let isFollowed = false
            let currentUser = jwt.decode(req.headers.authorization.split(' ')[1])
            if (user.followed.indexOf(currentUser.id) != -1) {
                isFollowed = true
            }
            res.status(200).json({username: user.username, bio: user.bio, followed: user.followed, following: user.following, isFollowed: isFollowed, profilePic: user.profilePic})
        }
    } catch {
        res.status(500).json({errors: [{msg: "There was an issue reaching the database"}]})
    }
})
exports.addUser = [
    body("username")
        .trim()
        .isLength({min: 1})
        .custom(async val => {
            const user = await User.findOne({username: val})
            if (user != undefined || user != null) {
                throw new Error('User Already exists')
            }
        })
        .escape(),
    body("password")
        .trim()
        .isLength({min: 6, max: 20})
        .escape(),
    body("confirm")
        .trim()
        .custom((val, {req}) => {
            return val === req.body.password
        })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(200).json({errors: errors.array()})
        } else {
            const salt = bcrypt.genSaltSync(10)
            const password = bcrypt.hashSync(req.body.password, salt)
            let newUser = new User({
                username: req.body.username,
                password: password,
                profilePic: '1',
                bio: 'This user has no bio',
                followed: [],
                following: []
            })
            try {
                await newUser.save()
                res.status(200).json({success: "User successfully created"})
            } catch {
                res.status(500)
            }
        }
    })
]
exports.loginUser = [
    body("username")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("password")
        .trim()
        .isLength({min: 5, max: 20})
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json({errors: errors.array()})
        } else {
            try {
                const user = await User.findOne({username: req.body.username})
                if (!user) {
                    res.json({errors: [{"msg": "This user does not exist"}]})
                } else if (!bcrypt.compareSync(req.body.password, user.password)) {
                    res.json({errors: [{"msg": "This password is incorrect"}]})
                } else {
                    let token = jwt.sign({id: user._id}, process.env.ACCESS_SECRET, {expiresIn: '7d'})
                    res.json({token})
                }
            } catch {
               res.status(500).json({errors: {msg: 'There has been an error reaching the server'}})
            }
        }
    })
]
exports.updateUser = [
    passport.authenticate('jwt', {session: false}),
    body("username")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("bio")
        .trim()
        .isLength({min: 5})
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(200).json({errors: errors.array()})
        } else {
            try {
                let token = req.headers.authorization.split(' ')[1]
                let user = jwt.decode(token)
                await User.findByIdAndUpdate(user.id, {username: req.body.username, bio: req.body.bio})
                res.status(200).json({success: "This user has been updated"})
            } catch {
                res.status(500).json({errors: [{msg: "There has been an error reaching the database"}]})
            }
        }
    })
]
exports.deleteUser = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        try {
            let token = req.headers.authorization.split(' ')[1]
            let user = jwt.decode(token)
            await User.findByIdAndDelete(user.id)
            res.status(200).json({success: 'The user was deleted successfully'})
        } catch {
            res.status(500).json({errors: [{msg: 'There was an error accessing the database'}]})
        }
    })
]
exports.updateUserPicture = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        const picId = uuid()
        try {
            const response = await cloudinary.uploader.upload(req.files[0].path, {public_id: picId})
            fs.unlink(req.files[0].path, (err) => {
                if (err) {console.log(err)}
                else console.log("file deleted")
            })
            if (response.url) {
                let token = req.headers.authorization.split(' ')[1]
                let user = jwt.decode(token)
                await User.findByIdAndUpdate(user.id, {profilePic: response.url})
                res.status(200).json({success: "The user's picture has been updated"})
            } else {
                res.status(500).json({errors: [{msg: "There was an error uploading the image"}]})
             }
        } catch (error) {
            console.log(error)
            res.status(200).json({errors: [{msg: 'There was an error uploading the image'}]})
        }
    })
]
exports.followUser = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        try {
            let user = jwt.decode(req.headers.authorization.split(' ')[1])
            if (user.id === req.params.userId) {
                res.status(200).json({errors: [{msg: 'You can not follow yourself'}]})
            } else {
                await User.findByIdAndUpdate(req.params.userId, {$push: {followed: user.id}})
                const userInfo = await User.findByIdAndUpdate(user.id, {$push: {following: req.params.userId}})
                res.status(200).json({user: {username: userInfo.username, profilePic: userInfo.profilePic}})
            }
        } catch {
            res.status(500).json({errors: [{msg: 'There has been an error reaching the database'}]})
        }
    })
]
exports.unfollowUser = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        try {
            let user = jwt.decode(req.headers.authorization.split(' ')[1])
            if (user.id === req.params.userId) {
                res.status(200).json({errors: [{msg: 'You can not follow yourself'}]})
            } else {
                await User.findByIdAndUpdate(req.params.userId, {$pull: {followed: user.id}})
                await User.findByIdAndUpdate(user.id, {$pull: {following: req.params.userId}})
                res.status(200).json({success: 'The user has been unfollowed successfully'})
            }
        } catch {
            res.status(500).json({errors: [{msg: 'There has been an error reaching the database'}]})
        }
    })
]
exports.getFollowing = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        const user = jwt.decode(req.headers.authorization.split(' ')[1])
        try {
            const users = await User.find({followed: user.id}).sort({_id: 1})
            let arr = []
            const createObj = (id, username, profilePic) => {
                return {
                    id: id,
                    username: username,
                    profilePic: profilePic
                }
            }
            for (i = 0; i < users.length; i++) {
                arr.push(createObj(users[i]._id, users[i].username, users[i].profilePic))
            }
            res.status(200).json({users: arr})
        } catch {
            res.status(500).json({errors: [{msg: 'There was an issue reaching the database'}]})
        }
    })
]
exports.getFollowed = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        try {
            const user = jwt.decode(req.headers.authorization.split(' ')[1])
            const users = await User.find({following: user.id})
            let idArr = []
            let usernameArr = []
            let profilePicArr = []
            for (i = 0; i < users.length; i++) {
                idArr.push(users[i]._id)
                usernameArr.push(users[i].username)
                profilePicArr.push(users[i].profilePic)
            }
            res.status(200).json({id: idArr, username: usernameArr, profilePic: profilePicArr})
        } catch {
            res.status(500).json({errors: [{msg: 'There was an issue reaching the database'}]})
        }
    })
]