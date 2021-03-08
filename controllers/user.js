const User=require('../models/user');

module.exports.renderRegister=(req,res,)=>{
    res.render('users/register');
 }
 module.exports.register=async (req,res,next)=>{
    
    try{
       const {username, password, email}=req.body;
   
     const user =new User({email, username});
     const registerUser=await User.register(user,password);
    req.login(registerUser,err=>{
        if(err)
        return next(err);
        req.flash('success','Welcome to Yelpcamp!');
        res.redirect('/campgrounds');
    });
  }
 catch(e)
 {
     req.flash('error',e.message);
     res.redirect('/register');
 }

}
module.exports.renderLogin=(req,res)=>{
    res.render('users/login');
}
module.exports.login=(req,res)=>{
    req.flash('success',"welcome Back!");
    const url=(req.session.returnTo)||'/campgrounds';
    delete req.session.returnTo;
    res.redirect(url);
}

module.exports.logout=(req,res)=>{
    req.logOut();
    req.flash('success','ByeBye');
    res.redirect('/campgrounds');
}
