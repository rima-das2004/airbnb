const listing=require("./models/listing.js")
const Review=require("./models/reviews.js")
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
    try{
        let s1 = res.locals.redirectUrl;
        let start = s1.indexOf("/listing/review/");
        let id = s1.slice(0, start) + s1.slice(start + "/listing/review/".length);
        if(res.locals.redirectUrl==`/listing/review/${id}`){
            res.locals.redirectUrl=`/listing/${id}`
        }
    }
    catch(err){
        console.log(err)
    }
  
    
   
   next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listingFind=await listing.findById(id)
    if(!(listingFind.owner.equals(res.locals.currentUser._id))){
      req.flash("error","You are not the owner")
      return res.redirect(`/listing/${id}`)
    }
    next();
}

module.exports.isAuthor=async(req,res,next)=>{
    let {id,revId}=req.params;
    let review=await Review.findById(revId).populate("author")
    if(!(review.author.equals(res.locals.currentUser._id))){
      req.flash("error","You are not the owner")
      return res.redirect(`/listing/${id}`)
    }
    next();
}