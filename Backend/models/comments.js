const {Schema, model} = require('mongoose')
const Comments = new Schema({
    content: {type: String, required: true},
    post: {type: String, required: true},
    userName: {type: String, required: true},
    userPhoto: {type: String, required: true},
    date: {type: Date, required: true},
    likes: {type: Array, required: true}
})
module.exports = model('Comments', Comments)