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
        res.status(200).json({msg: "Authorized"})
    }
]
exports.getUsers = asyncHandler (async (req, res, next) => {
    try {
        const users = await User.find().sort({_id: 1}).exec()
        if (users.length === 0) {
            res.status(200).json({users: []})
        } else {
            res.status(200).json({users: users})
        }
    } catch {
        res.status(200).json({msg: "There was an error reaching the server"})
    }
})
exports.getSomeUsers = asyncHandler (async (req, res, next) => {

})
exports.getSingleUser = asyncHandler (async (req, res, next) => {

})
exports.addUser = [
    body("username")
        .trim()
        .isLength({min: 1})
        .custom(async val => {
            try {
                const user = await User.findOne({username: val}) 
                if (user) {
                    throw new Error("User Already exists");
                }
            } catch (err) {
                console.log(err)
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
            res.json({errors: errors.array()})
        }
        const salt = bcrypt.genSaltSync(10)
        const password = bcrypt.hashSync(req.body.password, salt)
        let newUser = new User({
            username: req.body.username,
            password: password,
            profilePic: '',
            bio: '',
            following: []
        })
        try {
            await newUser.save()
            res.status(200).json({success: "User successfully created"})
        } catch (err) {
            res.status(500)
        }

    })
]
exports.loginUser = [
    body('username')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('password')
        .trim()
        .isLength({min: 5, max: 20})
        .escape(),
    asyncHandler(async (res, req, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(200).json({errors: errors.array()})
        } else {
            try {
                const user = await User.findOne({username: req.body.username})
                if (!user) {
                    res.status(404)
                } else if (!bcrypt.compareSync(req.body.password, user.password)) {
                    res.status(200).json({errors: [{msg: 'Password incorrect'}]})
                } else {
                    let token = jwt.sign({id: user._id}, process.env.ACCESS_SECRET, {expiresIn: '7d'})
                    res.status(200).json({token})
                }
            } catch {
                res.status(500)
            }
        }
    })
]
exports.updateUser = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {

    })
]
exports.deleteUser = [
    passport.authenticate('jwt', {session: false}),
    asyncHandler(async (req, res, next) => {
        
    })
]