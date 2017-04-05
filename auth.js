module.exports = {
    checkLogin: function(req,res,next){
        if(!req.session.user){
            req.flash('error','未登录，无法执行此操作，请先登陆');
            res.redirect('/user/login');
        }else {
            next();
        }
    },
    checkNotLogin: function(req,res,next){
        if(req.session.user){
            req.flash('error','已登录，无法执行此操作，请先退出');
            res.redirect('/');
        }else {
            next();
        }
    }
}
