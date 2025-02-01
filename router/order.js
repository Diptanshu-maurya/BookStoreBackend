const router=require("express").Router();
const User=require("../models/user");
const jwt=require("jsonwebtoken");
const {authenticateToken}=require("./userAuth");
const Book=require("../models/book");
const Order=require("../models/order");


router.post("/place-order",authenticateToken,async(req,res)=>{
  try {
    const {id}=req.headers;
    const {order}=req.body;

    for(const orderData of order){
      const newOrder=new Order({user:id,book:orderData._id});
      const orderDataFromDb=await newOrder.save();

      await User.findByIdAndUpdate(id,{
        $push:{orders:orderDataFromDb._id}
      });

      await User.findByIdAndUpdate(id,{
        $pull:{cart:orderDataFromDb._id}
      }); 
    }
    return res.json({status:"Success",message:"Order placed succesfully"}); 
  } catch (error) {
    return res.status(500).json({message:error});
  }
})

router.get("/get-order-history",authenticateToken,async(req,res)=>{
  try {
    const {id}=req.headers;
    const userData=await User.findById(id).populate({
      path:"orders",
      populate:{path:"book"}
    })
    const orderData=userData.orders.reverse();
    return res.json({
      status:"success",
      data:orderData,
    })
    
  } catch (error) {
    return res.json({message:"Intenal error"});
  }
})

router.get("/get-all-order",authenticateToken,async(req,res)=>{
  try {

    const userData=await Order.find()
    .populate({
      path:"book"
    })
    .populate({
      path:"user",
    })
    .sort({createdAt:-1});
    return res.json({
      status:"Success",
      data:userData
    })



    
  } catch (error) {
    return res.status(500),json({message:"Internal error"})
  }
})

router.get("/update-status/:id",authenticateToken,async(req,res)=>{
  try {
    const {id}=req.params;
    await Order.findByIdAndUpdate(id,{status:req.body.status});
    return res.json({
      status:"Success",
      message:"Status Updated Succesfully",
    });



    
  } catch (error) {
    return res.status(500),json({message:"Internal error"})
  }
})




module.exports=router;
