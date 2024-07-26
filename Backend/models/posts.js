const {Schema, model} = require('mongoose')
const Posts = new Schema ({
    user: {type: String, required: true},
    userPhoto: {type: String, required: true},
    content: {type: String, required: true},
    photo: {type: String},
    likes: {type: Array, required: true},
    date: {type: Date, required: true}
})
module.exports = model('Post', Posts)