const express=require("express");
const app=express();
const router=express.Router();
const listing=require("../models/listing.js")//listing model
//app.use(express.static(path.join(__dirname,"/public")));
const asyncWrap=require("../utils/AsyncWrap.js")
const ExpressError=require("../utils/ExpressError.js")
//const {listingSchema, reviewSchema}=require("../joiSchema.js");
const User=require("../models/user");
const passport=require("passport");
const passportLocal=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");

router.get("/signup",(req,res)=>{
    res.render("listing/signUp.ejs")
})
router.post("/signup",asyncWrap(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const user1= new User({
            username:username,
            email:email
        })
        let regUser=await User.register(user1,password);
        console.log(regUser);
        req.flash("success","Welcome to GypsyVerse");
        res.redirect("/listing");
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }

}))
router.get("/login",async(req,res)=>{
    res.render("listing/login.ejs")
})
router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back to GypsyVerse");
    res.redirect("/listing")
 
})
module.exports=router;