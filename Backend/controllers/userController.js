const asyncHandler = require('express-async-handler')
const {validationResult, body} = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config()
const cloudinary = require('cloudinary').v2
const uuid = require('uuid').v4
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
                            profilePic: "../../blank-profile-picture-973460_640.png"
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
            if (user.profilePic === '1') {
                res.status(200).json({username: user.username, bio: user.bio, followed: user.followed ,following: user.following})
            } else {

                res.status(200).json({username: user.username, bio: user.bio, followed: user.followed, following: user.following})
            }
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
            const response = await cloudinary.uploader.upload(req.body.img, {public_id: picId})
            if (response.status === 200) {
                let token = req.headers.authorization.split(' ')[1]
                let user = jwt.decode(token)
                await User.findByIdAndUpdate(user.id, {profilePic: picId})
                res.status(200).json({success: "The user's picture has been updated"})
            } else {
                let info = await response.json().error.message
                res.status(500).json({errors: [{msg: info}]})
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({errors: [{msg: 'There was an error uploading the image'}]})
        }
    })
]