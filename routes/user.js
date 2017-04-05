var express = require('express');
var router = express.Router();
var md5 = require('../md5');
var mongo = require('../database');
var auth = require('../auth');

// 登陆
router.get('/login',auth.checkNotLogin, function(req, res, next) {
    res.render('user/login',{title: "登陆"});
});

// 登陆表单提交
router.post('/login',auth.checkNotLogin,function(req,res,next){
    var userInfo = req.body;
    var username = userInfo.username;
    var password = md5(userInfo.password);
    mongo.userModel.findOne({username: username},function(err,doc){
        if(!err){
            if(doc){
                if(doc.password == password){
                    req.session.user = doc;
                    req.flash('success','登陆成功');
                    res.redirect('/');
                } else {
                    req.flash('error','密码错误');
                    res.redirect('back');
                }
            }else {
                req.flash('error','用户名不存在');
                res.redirect('back');
            }
        }else {
            req.flash('error','登陆失败请尝试重新登陆');
            res.redirect('back');
        }
    })
})

// 注册
router.get('/signin',auth.checkNotLogin, function(req, res, next) {
    res.render('user/signin',{title: "注册"});
});

// 注册表单提交
router.post('/signin',auth.checkNotLogin,function(req,res,next){
    var userInfo = req.body;
    var reg = /^\w{6,12}$/;
    var emailreg = /^(\w+)@(\w+)\.([a-z]+)$/;
    if(reg.test(userInfo.username) ||reg.test(req.body.password)){
        if(emailreg.test(userInfo.email)){
            mongo.userModel.find({username: userInfo.username},function(err,doc){
                if(!doc.length){
                    userInfo.password = md5(userInfo.password + "");
                    userInfo.avatar = "http://secure.gravatar.com/avatar/" + userInfo.email + "?s=32";
                    mongo.userModel.create(userInfo,function(){
                        req.flash('success','注册账户成功!');
                        res.redirect('/user/login');
                    })
                }else {
                    req.flash('error','用户名已被使用！');
                    res.redirect('back');
                }
            })
        } else {
            req.flash('error','请输入正确的邮箱');
            res.redirect('back');
        }
    }else {
        req.flash('error','请输入在6到12位用户名/密码，并且不能包含特殊字符！')
        res.redirect('back');
    }
})

// 退出
router.get('/exit',auth.checkLogin, function(req, res, next) {
    req.session.user = null;
    res.redirect('/');
});

// 个人中心
router.get('/mycenter', auth.checkLogin,function(req, res, next) {
    var userId = req.query._id;
    console.log(userId);
    mongo.articleModel.find({author: userId},function(err,articles){
        if(!err){
            res.render('user/mycenter',{title: "个人中心", articles: articles});
        }else {
            req.flash('error','获取文章数据失败，请稍后再试！');
            res.redirect('back');
        }
    })
});



module.exports = router;
