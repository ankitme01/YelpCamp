
const mongoose = require('mongoose');
const campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');

mongoose.connect('mongodb://localhost/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("connected to database");
});
const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 180; i++) {
    const random180 = Math.floor(Math.random() * 180);
    const price = Math.floor(Math.random() * 100) + 1;
    const camp = new campground({
      location: `${cities[random180].city},${cities[random180].admin_name}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price,
      author: '6042658aa418ad03788d41f1',
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random180].lng,
          cities[random180].lat,
      ]
      },
      images: [
        {

          url: 'https://res.cloudinary.com/dsjckmnzx/image/upload/v1615387611/YelpCamp/uw0ipmcueezjqfojdb56.jpg',
          filename: 'YelpCamp/uw0ipmcueezjqfojdb56'
        },
        {

          url: 'https://res.cloudinary.com/dsjckmnzx/image/upload/v1615387610/YelpCamp/fk6expktyyjyj5h2fvuu.jpg',
          filename: 'YelpCamp/fk6expktyyjyj5h2fvuu'
        }
      ],
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae eaque rerum consequatur reiciendis a deserunt molestias eligendi sunt explicabo cumque sed deleniti mollitia esse, nostrum libero magnam dolorem ut quam."
    })
    await camp.save();
  }

}
seedDB()
  .then(() => {
    mongoose.connection.close();
  })