const {Schema, model} = require('mongoose')
const Posts = new Schema ({
    user: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, required: true},
    photo: {type: String},
    likes: {type: Number, required: true},
    date: {type: Date, required: true}
})
module.exports = model('Post', Posts)