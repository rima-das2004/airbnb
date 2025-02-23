const express=require("express");
const app=express();
const router=express.Router();
const listing=require("../models/listing.js")//listing model
//app.use(express.static(path.join(__dirname,"/public")));
const asyncWrap=require("../utils/AsyncWrap.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema, reviewSchema}=require("../joiSchema.js");




const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
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

router.get("/",async(req,res)=>{
    const listData= await listing.find({});
    res.render("listing/index.ejs",{listData})
  })
router.get("/create",(req,res)=>{
    res.render("listing/create.ejs")
  })
router.post("/",validateListing,asyncWrap( async (req,res)=>{
    
    let list=req.body.listing;
    
    //console.log(list)
    let newSample= new listing(list)
    await newSample.save();
    res.redirect("/listing");
  }))
router.get("/:id",asyncWrap( async (req,res)=>{
    let {id}=req.params;
    let DataById=await listing.findById(id).populate("reviews");
    res.render("listing/show.ejs",{DataById});
  }))
  
router.get("/:id/edit",asyncWrap( async(req,res)=>{
    
    let {id}=req.params;
    console.log(id)
    let EditData=await listing.findById(id)
    console.log(EditData)
    res.render("listing/edit.ejs",{EditData});
  }))
  
router.put("/:id",validateListing,asyncWrap( async (req,res)=>{
    console.log(req.params)
    let {id}=req.params;
    let dataEdit=req.body.listing; 
    //console.log(dataEdit)
    const spread=await listing.findByIdAndUpdate(id,{...dataEdit})
    //console.log("spread",spread)
    res.redirect(`/listing/${id}`);
  }))
  
router.delete("/:id",asyncWrap(  async (req,res)=>{
    let {id}=req.params;
    await listing.deleteOne({_id:id})
    res.redirect("/listing");
  }));
  


  module.exports=router;