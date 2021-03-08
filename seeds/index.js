
const  mongoose  = require('mongoose');
const campground = require('../models/campground');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelper');

mongoose.connect('mongodb://localhost/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to database");
});
const sample= array => array[Math.floor(Math.random()*array.length)];
const seedDB= async()=>{
    await campground.deleteMany({});
    for(let i=0;i<50;i++)
    {
        const random1000=Math.floor(Math.random()*1000);
      const price=Math.floor(Math.random()*100)+1;
        const camp =new campground({
          location:`${cities[random1000].city},${cities[random1000].state}`,
          title:`${sample(descriptors)} ${sample(places)}`,
          price,
          author:'6042658aa418ad03788d41f1',
          image:"https://source.unsplash.com/collection/483251",
          description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae eaque rerum consequatur reiciendis a deserunt molestias eligendi sunt explicabo cumque sed deleniti mollitia esse, nostrum libero magnam dolorem ut quam."
      })
      await camp.save();
    }
     
}
seedDB()
.then(()=>{
    mongoose.connection.close();
})