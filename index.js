const express=require("express");
const app=express();
const mongoose=require("mongoose");
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
const {listingSchema, reviewSchema}=require("./joiSchema.js");
const session=require("express-session");
const flash=require("connect-flash")
const passport=require("passport");
const passportLocal=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");
const listing=require("./routes/listing.js");
const review=require("./routes/reviews.js");
const user=require("./routes/users.js");
const User=require("./models/user.js")
const sessionOpt={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    httpOnly:true,
    maxAge:7*24*60*60*1000
  }
}
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

app.use(session(sessionOpt));
app.use(flash())
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.errMsg=req.flash("error");
  next()
})
//passport
app.use(passport.initialize());
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use("/listing",listing);
app.use("/listing",review);
app.use("/",user)


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




