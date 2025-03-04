module.exports.isLoggedIn=(req,res,next)=>{
    req.session.redirectUrl=req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in for accesing this website");
        return res.redirect("/login")
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
   next();
}