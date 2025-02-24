const mongoose=require("mongoose");


const order=mongoose.Schema({
   user:{
    type:mongoose.Types.ObjectId,
    ref:"user",
   },
   book:{
    type:mongoose.Types.ObjectId,
    ref:"books",
   },
   status:{
    type:String,
    default:"Order placed",
    enum:["Order placed","out for delivery","delivered","canceled"]
   }

},{timestamps:true}
);

module.exports=mongoose.model("order",order);