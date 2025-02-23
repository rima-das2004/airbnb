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
    res.redirect(`/listing/${id}`);
  
  }))
  
  router.delete("/:id/review/:revId",asyncWrap(async(req,res)=>{
    let{id,revId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:revId}});
    await Review.findByIdAndDelete(revId)
    res.redirect(`/listing/${id}`);
  }))
  
  
  router.get("/:listId/review/edit/:id",asyncWrap( async(req,res)=>{
    let {listId,id}=req.params;
    console.log(id)
    let data=await Review.findById(id);
    console.log(data)
    res.render("listing/reviewEdit.ejs",{data,listId:listId});
  }))
  
  router.put("/:listId/review/edit/:id",validateReview,asyncWrap( async(req,res)=>{
    let {listId,id}=req.params;
    let data=req.body.review;
    console.log("comment",data.comment)
    await Review.findByIdAndUpdate(id,{comment:data.comment,rating:data.rating,createdAt:Date.now()})
    res.redirect(`/listing/${listId}`)
  }))
  
  module.exports=router