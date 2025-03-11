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
const {saveRedirectUrl}=require("../middleware.js")
const otp_verify = require("otp-verify");
var nodemailer = require('nodemailer');

let otp = "",otpInV;
let user1,passwordVerify;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure:true,
  port:465,
  host:"smtp@gmail.com",
  auth: {
    user: 'contacturbanharvestofficially@gmail.com',
    pass: 'vidm vhmk mhhb jgec'
  }
});

router.get("/signup",(req,res)=>{
    res.render("listing/signUp.ejs")
})
router.post("/signup",saveRedirectUrl,asyncWrap(async(req,res)=>{
    try{
        let otpLength=5;
        
        for (let i = 1; i <= otpLength; i++) {
          otp += Math.floor(Math.random() * 10);
        }
        let {username,email,password}=req.body;
        passwordVerify=password;
        user1= new User({
            username:username,
            email:email
        })
        var mailOptions = {
            from:'"Verification" <contacturbanharvestofficially@gmail.com>',
            to: email,
            subject: 'email verification',
            html:`<h1>Dear ${username}<h1/><br><h5>An email verification from Urban Harvest Supermarket</h5><br><p>your otp is ${otp}</p><br><p>Thank you for accesing UrbanHarvest</p>`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + otp);
            }
          });
          
        
        res.redirect("/verify");

    }

    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }

}))

router.get("/verify",(req,res)=>{
     otpInV=otp;
    otp=""
    console.log("in",res.locals.otpVerify)
    res.render("listing/verify.ejs")
})
router.post("/verify",asyncWrap(async(req,res)=>{
   
    let {first,sec,third,fourth,fifth}=req.body;//45128=4*10000
    let otpVerifyCal=first*10000+sec*1000+third*100+fourth*10+fifth*1
    console.log(otpVerifyCal,otpInV)
    if(otpVerifyCal===Number(otpInV) && (Number(otpInV))){

        let redirectUrl=res.locals.redirectUrl;
        //console.log(redirectUrl)
        let regUser=await User.register(user1,passwordVerify);
        req.login(regUser,(err)=>{
            if(err){
                return next(err)
            }
            if(redirectUrl){
                req.flash("success","Welcome to GypsyVerse");
                res.redirect(redirectUrl);
            }
            else{
                req.flash("success","Welcome to GypsyVerse");
                res.redirect("/listing");
    
            }
    
        })
        
    }
    else{
        req.flash("error","Registration failed")
        res.redirect("/listing")
    }

    
}))

router.get("/login",async(req,res)=>{
    res.render("listing/login.ejs")
})
router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back to GypsyVerse");
   
    let redirectUrl=res.locals.redirectUrl;
    if(redirectUrl){
        res.redirect(redirectUrl)
    }
    else{
        res.redirect("/listing")
    }
 
})
router.get("/logout",async (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","you are successfully logged out")
        res.redirect("/listing")
    })
})
module.exports=router;