const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("../models/listing.js")
const initData=require("./data.js");
//console.log(initData)
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

const initDb=async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log("done");
}
//initDb();
