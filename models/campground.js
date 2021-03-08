const { Schema } = require("mongoose");
const Review=require('./review');
const mongoose=require('mongoose');
const schema=mongoose.Schema;

const campgroundSchema=new schema({
    title:String,
    price:Number,
    image:String,
    description:String,
    location:String,
    author:{
        type: Schema.Types.ObjectId, 
        ref:'User' 
    
    },
    reviews:[{
         type: Schema.Types.ObjectId, 
            ref:'Review' 
        }]
});
campgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc)
    {
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})
module.exports=mongoose.model('Campground',campgroundSchema);