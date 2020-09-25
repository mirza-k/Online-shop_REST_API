const mongoose = require('mongoose');

const schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    content: {type: String, required: true}
})

module.exports = mongoose.model("Post",schema);