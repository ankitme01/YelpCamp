if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}



const express = require('express');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');
const path = require('path');
const expressError=require('./utils/expressError');
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require('helmet');
const session=require('express-session');
const ejsMate = require('ejs-mate');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const {styleSrcUrls,scriptSrcUrls,fontSrcUrls,connectSrcUrls}=require('./contentSecure');
const campgroundRouter=require('./routes/campground');
const reviewRouter=require('./routes/reviews');
const userRouter=require('./routes/user');
const MongoDBStore = require("connect-mongo"); 
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, '/views'));

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.use(mongoSanitize());

app.use(express.static(path.join(__dirname, 'public')));

const dbUrl=process.env.DB_URL||'mongodb://localhost/yelp-camp';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("connected to MongoDB");
});
const secret=process.env.SECRET||'thisismysecret';
const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e)
})
const sessionConfig={
     store,
    name:"session",
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(express.urlencoded({ extended: true }));
 


app.use(session(sessionConfig));


app.use(flash());
app.use(helmet());



app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dsjckmnzx/", 
              "https://images.unsplash.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.currentUser=req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  next();
})

app.use('/',userRouter);
app.use('/campgrounds',campgroundRouter)
app.use('/campgrounds/:id/reviews',reviewRouter)

app.get('/', (req, res) => {
console.log(req.query);
  res.render('home');
})
app.all('*',(req,res,next)=>{
  next(new expressError('PAGE NOT FOUND',404));
  })

app.use((err,req,res,next)=>{
     const {message="SERVER ERROR",statusCode=505} = err;
     res.status(statusCode).render('error',{err});
})
const port=process.env.PORT||3000;
app.listen(port, () => {
  console.log(`LISTENING TO PORT ${port}`);
})