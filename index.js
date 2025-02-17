const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./models/listing.js")
const ejs=require("ejs");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
app.set("view engine","ejs");
const path=require("path")
app.set("views",path.join(__dirname,"views"));
const engine=require("ejs-mate");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",engine);
app.use(express.static(path.join(__dirname,"/public")));
const asyncWrap=require("./utils/AsyncWrap.js")
const ExpressError=require("./utils/ExpressError.js")
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/GypsyVerse');
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }
main().then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err)
})

app.listen(8080,()=>{
    console.log("Server is listening")
})

app.get("/",(req,res)=>{
    res.send("working");
})

// app.get("/test", (req,res)=>{
//     let SampleList= new listing({
//         title:"Villa",
//         description:"new villa",
//         price:50000,
//         location:"Goa",
//         country:"India",
        
//     })
    
//   SampleList.save().then((res)=>{
//     console.log(res)
//   })
//   .catch((err)=>{
//     console.log(err)
//   })
//     res.send("OK")
// })
app.get("/listing",async(req,res)=>{
  const listData= await listing.find({});
  res.render("listing/index.ejs",{listData})
})
app.get("/listing/create",(req,res)=>{
  res.render("listing/create.ejs")
})
app.post("/listing",asyncWrap( async (req,res)=>{
  let list=req.body.listing;
  console.log(list)
  let newSample= new listing(list)
  await newSample.save();
  res.redirect("/listing");
}))
app.get("/listing/:id",asyncWrap( async (req,res)=>{
  let {id}=req.params;
  let DataById=await listing.findById(id);
  res.render("listing/show.ejs",{DataById});
}))

app.get("/listing/:id/edit",asyncWrap( async(req,res)=>{
  
  let {id}=req.params;
  console.log(id)
  let EditData=await listing.findById(id)
  console.log(EditData)
  res.render("listing/edit.ejs",{EditData});
}))

app.put("/listing/:id",asyncWrap( async (req,res)=>{
  console.log(req.params)
  let {id}=req.params;
  let dataEdit=req.body.listing; 
  await listing.findByIdAndUpdate(id,{...dataEdit})
  res.redirect(`/listing/${id}`);
}))

app.delete("/listing/:id",asyncWrap(  async (req,res)=>{
  let {id}=req.params;
  await listing.deleteOne({_id:id})
  res.redirect("/listing");
}));

app.get("/admin",(req,res)=>{
  throw new ExpressError(403,"only admin can access")
})

app.all("*",(req,res,next)=>{
  throw new ExpressError(404,"page not found");

})

app.use((err,req,res,next)=>{
  let{status=500,message="something went wrong"}=err;
  res.status(status).render("errorModel/first.ejs",{message:message})
})