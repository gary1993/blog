var express = require('express');
var router = express.Router();
var articleModel = require('../database').articleModel;
var commentModel = require('../database').commentModel;
var auth = require('../auth');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'../public/upload');
    },
    filename: function(req,file,cb){
        var fileFormat = file.originalname.split('.');
        cb(null,fileFormat[0] + "-" + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})

var upload = multer({storage: storage});

router.get('/add',auth.checkLogin,function(req,res,next){
    res.render('article/add',{title: '发表文章'})
})

router.post('/add',auth.checkLogin,upload.single('picture'),function(req,res,next){
    var articleInfo = req.body;
    if(req.file){
        articleInfo.picture = '/upload/' + req.file.filename;
    }
    articleInfo.date = new Date().toLocaleString();
    articleInfo.author = req.session.user;
    articleModel.create(articleInfo,function(){
        res.redirect('/');
    })
})

router.get('/detail',function(req,res,next){
    var query = {};
    articleModel
    .findById(req.query._id)
    .populate('author')
    .exec(function(err,article){
        if(!err){
            query.title = article.topic;
            query.article = article;
            query.userId = req.session.user ? req.session.user._id : null;
            commentModel
            .find({article: article._id})
            .populate('author')
            .exec(function(err,comments){
                    query.comments = comments;
                    res.render('article/detail',query);
                })
        }else {
            req.flash('error','获取文章数据失败！');
            res.redirect('back');
        }
    })
})

router.get('/delete',auth.checkLogin,function(req,res,next){
    var id = req.query._id;
    articleModel.remove({_id: id},function(err,doc){
        if(!err){
            res.redirect('/');
        }else {
            req.flash('error','删除数据失败，请稍后再试!');
            res.redirect('back');
        }
    })
})

router.get('/update',auth.checkLogin,function(req,res,next){
    var id = req.query._id;
    articleModel.findById(id,function(err,article){
        res.render('article/update',{title: "更新",article: article});
    })
})

router.post('/update',auth.checkLogin,upload.single('picture'),function(req,res,next){
    var id = req.query._id;
    var articleInfo = req.body;
    if(req.file){
        articleInfo.picture = '/upload/' + req.file.filename;
    }
    articleInfo.date = new Date().toLocaleString();
    articleModel.update({_id: id},{$set: articleInfo},function(err,doc){
        if(!err){
            res.redirect('/article/detail?_id=' + id);
        }else {
            req.flash('error','更新文章失败，请稍后再试!');
            res.redirect('back');
        }
    })
})

router.post('/comment',auth.checkLogin,function(req,res,next){
    var commentInfo = req.body;
    commentInfo.date = new Date().toLocaleString();
    commentInfo.author = req.session.user._id;
    commentInfo.article = req.query._id;
    commentModel.create(commentInfo,function(err,doc){
        res.redirect('back');
    })
})




module.exports = router;
