const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("../models/reviews.js")//review model
const Listing=require("../models/listing.js");
const passport=require("passport");
const passportLocal=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);