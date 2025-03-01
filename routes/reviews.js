const express=require("express");
const app=express();
const router=express.Router({mergeParams:true});
const Review=require("../models/reviews.js")//review model
const listing=require("../models/listing.js");
const asyncWrap=require("../utils/AsyncWrap.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema, reviewSchema}=require("../joiSchema.js");


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


  router.post("/review",validateReview,asyncWrap(async(req,res)=>{
    let reviewRes=req.body.review;
    let {id}=req.query;
    let rev=new Review({...reviewRes});
    console.log(rev)
    let list=await listing.findById(id);
    console.log(list)
    list.reviews.push(rev)
    await rev.save();
    await list.save();
    req.flash("success","Review is successfully created");
    res.redirect(`/listing/${id}`);
  
  }))
  
  router.delete("/:id/review/:revId",asyncWrap(async(req,res)=>{
    let{id,revId}=req.params;
    let listingData=await listing.findById(id);
    let reviewData=await Review.findById(revId)
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
  
  
  router.get("/:listId/review/edit/:id",asyncWrap( async(req,res)=>{
    let {listId,id}=req.params;
    console.log(id);
    let listingData=await listing.findById(listId);
    let reviewData=await Review.findById(id)
    console.log(reviewData)
    if(!(listingData && reviewData)){
      req.flash("error","List you are searching for does not exist");
      res.redirect("/listing")
    }
    else{
    let data=await Review.findById(id);
    console.log(data)
    res.render("listing/reviewEdit.ejs",{data,listId:listId});
    }
  }))
  
  router.put("/:listId/review/edit/:id",validateReview,asyncWrap( async(req,res)=>{
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