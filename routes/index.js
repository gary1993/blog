var express = require('express');
var router = express.Router();
var articleModel = require('../database').articleModel;

/* GET home page. */
router.get('/', function(req, res, next) {
    var query = {};
    if(req.query.keywords){
        var keywords = req.query.keywords ? req.query.keywords : '';
        var reg = new RegExp(keywords,'i');
        query = {$or:[{topic: reg},{content: reg}]};
    }
    articleModel.count(query,function(err,n){
        var currentPage = req.query.page ? req.query.page : 1;
        var totalPage = Math.ceil(n / 6);
        articleModel.find(query)
        .populate('author')
        .sort({_id: -1})
        .skip((currentPage - 1) * 6)
        .limit(6)
        .exec(function(err,articles){
            if(!err){
                res.render('index', {title: '主页' ,
                    articles: articles ,
                    currentPage: currentPage,
                    totalPage: totalPage,
                    keywords: keywords
                });
            }else {
                res.redirect('/');
            }
        })
    })
});

module.exports = router;
