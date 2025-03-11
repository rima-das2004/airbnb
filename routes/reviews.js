const express=require("express");
const app=express();
const router=express.Router({mergeParams:true});
const Review=require("../models/reviews.js")//review model
const listing=require("../models/listing.js");
const asyncWrap=require("../utils/AsyncWrap.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema, reviewSchema}=require("../joiSchema.js");
const {isLoggedIn, isOwner,isAuthor}=require("../middleware.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error)
    if(error){
      let errMsg=error.details.map((el)=> el.message).join(",");
      console.log(errMsg)
      throw new ExpressError(400, errMsg)
    }
    else{
      next();
    }
  }


  router.post("/review/:id",isLoggedIn,validateReview,asyncWrap(async(req,res)=>{
    console.log("in it");
    let reviewRes=req.body.review;
    let {id}=req.params;
    let rev=new Review({...reviewRes});
    rev.author=req.user._id;
    console.log(rev)
    let list=await listing.findById(id);
    console.log(list)
    list.reviews.push(rev)
    await rev.save();
    await list.save();
    req.flash("success","Review is successfully created");
    res.redirect(`/listing/${list._id}`);

  }))
  
  router.delete("/:id/review/:revId",isAuthor,asyncWrap(async(req,res)=>{
    let{id,revId}=req.params;
    
    let listingData=await listing.findById(id);
    let reviewData=await Review.findById(revId).populate("author")
    console.log("authorzji: ",reviewData.author)
   
    if(!(listingData && reviewData)){
      req.flash("error","List you are searching for does not exist");
      res.redirect("/listing")
    }
    else{
     
        await listing.findByIdAndUpdate(id,{$pull:{reviews:revId}});
        await Review.findByIdAndDelete(revId)
        req.flash("success","Successfully Deleted");

     
      res.redirect(`/listing/${id}`);
    }
    
    
  }))
  
  
  router.get("/:id/review/edit/:revId",isAuthor,asyncWrap( async(req,res)=>{
    let {id,revId}=req.params;
    console.log(id);
    let listingData=await listing.findById(id);
    let reviewData=await Review.findById(revId)
    console.log(reviewData)
    if(!(listingData && reviewData)){
      req.flash("error","List you are searching for does not exist");
      res.redirect("/listing")
    }
    else{
    let data=await Review.findById(revId);
    console.log(data)
    res.render("listing/reviewEdit.ejs",{data,id:id});
    }
  }))
  
  router.put("/:listId/review/edit/:id",isAuthor,validateReview,asyncWrap( async(req,res)=>{
    let {listId,id}=req.params;
    let data=req.body.review;
    console.log("comment",data.comment)
    let listingData=await listing.findById(listId);
    let reviewData=await Review.findById(id)
    if(!(listingData && reviewData)){
      req.flash("error","Review you are searching for does not exist");
      res.redirect("/listing")
    }
    else{
    await Review.findByIdAndUpdate(id,{comment:data.comment,rating:data.rating,createdAt:Date.now()});
    req.flash("success","Successfully Updated");

    res.redirect(`/listing/${listId}`)}
  }))
  
  module.exports=router