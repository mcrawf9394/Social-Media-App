const {Schema, model} = require('mongoose')
const User = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    profilePic: {type: String, required: true},
    bio: {type: String, required: true},
    following: {type: Array, required: true}
})
module.exports = model("User", User)