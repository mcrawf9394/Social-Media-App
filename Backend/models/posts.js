const {Schema, model} = require('mongoose')
const Posts = new Schema ({
    userName: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, required: true}
})
module.exports = model('Post', Posts)