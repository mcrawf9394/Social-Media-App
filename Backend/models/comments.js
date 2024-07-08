const {Schema, model} = require('mongoose')
const Comments = new Schema({
    content: {type: String, required: true},
    post: {type: String, required: true},
    userName: {type: String, required: true}
})
module.exports = model('Comments', Comments)