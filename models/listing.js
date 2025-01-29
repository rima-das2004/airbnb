const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:
        
        {   filename:String,
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
    }
})

const listing =mongoose.model("Listing",listSchema)//creating collection
module.exports=listing
