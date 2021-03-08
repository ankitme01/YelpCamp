const { Router } = require('express');
const express=require('express');
const router=express.Router();
const passport = require('passport');
const catchAsync=require('../utils/catchAsync');
const user=require('../controllers/user');

router.get('/register',user.renderRegister);

router.post('/register',catchAsync(user.register));
router.get('/login',user.renderLogin);

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.login);
router.get('/logout',user.logout);

module.exports= router;
