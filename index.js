const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./models/listing.js")
const ejs=require("ejs");
app.set("view engine","ejs")
const path=require("path")
app.set("views",path.join(__dirname,"views"));
const ejsMate=require("ejs-mate");
app.use(express.urlencoded({extended:true}));
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
app.post("/listing",async (req,res)=>{
  let list=req.body.listing;
  console.log(list)
  let newSample= new listing(list)
  newSample.save().then((res)=>{
    console.log(res)
  })
  .catch((err)=>{
    console.log(err);
  })
  res.redirect("/listing");
})
app.get("/listing/:id",async (req,res)=>{
  let {id}=req.params;
  let DataById=await listing.findById(id);
  res.render("listing/show.ejs",{DataById});
})

