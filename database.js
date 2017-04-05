var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/data");
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    avatar: String
})
var userModel = mongoose.model('user',userSchema);

var articleSchema = mongoose.Schema({
    topic: String,
    content: String,
    picture: String,
    date: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})
var articleModel = mongoose.model('article',articleSchema);

var commentSchema = mongoose.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'article'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date: String,
    content: String
})
var commentModel = mongoose.model('comment',commentSchema);


module.exports = {
    userModel: userModel,
    commentModel: commentModel,
    articleModel: articleModel
}