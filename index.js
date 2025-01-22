const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./models/listing.js")

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

app.get("/test",(req,res)=>{
    let SampleList= new listing({
        title:"Villa",
        description:"new villa",
        price:50000,
        location:"Goa",
        country:"India"
    })
    res.send("OK")
    SampleList.save()
})

