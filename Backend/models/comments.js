const {Schema, model} = require('mongoose')
const Comments = new Schema({
    content: {type: String, required: true},
    post: {type: Schema.Types.ObjectId,  ref: 'Posts', required: true},
    userName: {type: String, required: true},
    date: {type: Date, required: true}
})
module.exports = model('Comments', Comments)