const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("../models/reviews.js")//review model

const listSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:
        
        {   filename:{
            type:String,
            set:(v)=> v===""? "listName":v
        },
            url:{
                type:String,
            default:"https://www.luxuryvillasingoa.co.in/wp-content/uploads/2018/05/oceandeck-1024x683.jpg",
            set: (v)=> v===""? "https://www.luxuryvillasingoa.co.in/wp-content/uploads/2018/05/oceandeck-1024x683.jpg":v
        
        }
        
        }
    
    ,
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
})
listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
    
})
const listing =mongoose.model("Listing",listSchema)//creating collection
module.exports=listing
