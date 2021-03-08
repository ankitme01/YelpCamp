const express = require('express');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');
const path = require('path');
const expressError=require('./utils/expressError');



const session=require('express-session');
app.use(methodOverride('_method'))
const ejsMate = require('ejs-mate');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');

const campgroundRouter=require('./routes/campground');
const reviewRouter=require('./routes/reviews');
const userRouter=require('./routes/user');

app.set('views', path.join(__dirname, '/views'));

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig={
    secret:"Thisismysecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("connected to MongoDB");
});

app.use(session(sessionConfig));


app.use(flash());

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

  res.render('home');
})
app.all('*',(req,res,next)=>{
  next(new expressError('PAGE NOT FOUND',404));
  })

app.use((err,req,res,next)=>{
     const {message="SERVER ERROR",statusCode=505} = err;
     res.status(statusCode).render('error',{err});
})

app.listen(3000, () => {
  console.log("LISTENING TO PORT 3000");
})