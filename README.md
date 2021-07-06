# YelpCamp

![Screenshot (23)](https://user-images.githubusercontent.com/69082575/112000449-03a34200-8b44-11eb-89a2-5c786edd956b.png)


![Screenshot (24)](https://user-images.githubusercontent.com/69082575/112000643-31888680-8b44-11eb-95d6-269a0372c236.png)


![Screenshot (25)](https://user-images.githubusercontent.com/69082575/112000717-3f3e0c00-8b44-11eb-9479-1c898d741bf5.png)

YelpCamp is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account. 

This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication. 

## Live Demo
 To see the app in action, go to https://fierce-shelf-89513.herokuapp.com/
## Features
* Authentication:
  * User login with username and password
  
  * Admin sign-up with admin code
  
* Authorization:
  * One cannot manage posts and view user profile without being authenticated
  
  * One cannot edit or delete posts and comments created by other users
  
  * Admin can manage all posts and comments
  
* Manage campground posts with basic functionalities:

  * Create, edit and delete posts and comments
  
  * Upload campground photos
  
  * Display campground location on Google Maps
  
* Flash messages responding to users' interaction with the app

* Responsive web design

* Custom Enhancements

* Update campground photos when editing campgrounds

* Improve image load time on the landing page using Cloudinary

* Used Helmet to strengthen security

## Built with

### Front-end
* ejs
* Bootstrap
### Back-end
* express
* mongoDB
* mongoose
* async
* crypto
* helmet
* passport
* passport-local
* express-session
* method-override
* moment
* cloudinary
* geocoder
* connect-flash
