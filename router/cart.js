const router=require("express").Router();
const User=require("../models/user");
const {authenticateToken}=require("./userAuth");

router.put("/add-to-cart",authenticateToken,async(req,res)=>{
  try {
    const {bookid,id}=req.headers;
    const userData=await User.findById(id);
    const isBookInCart=userData.cart.includes(bookid);
    if(isBookInCart){
      return res.json({message:"Book is already in cart"})
    }
    await User.findByIdAndUpdate(id,{
      $push:{cart:bookid},
    });
    return res.json({message:"book added to cart"});


  } catch (error) {
     return res.json({message:"something went wrong"})
  }

});
router.put("/remove-to-cart/:bookid",authenticateToken,async(req,res)=>{
  try {
    const {bookid}=req.params;
    const {id}=req.headers;
    await User.findByIdAndUpdate(id,{
      $pull:{cart:bookid}
    })
    return res.json({message:"Book is removed from cart"})
   

  } catch (error) {
     return res.json({message:"something went wrong"})
  }

});


router.get("/get-user-cart",authenticateToken,async(req,res)=>{
  try {
    const {id}=req.headers;
    const userData=await User.findById(id).populate("cart");
    const cart=userData.cart.reverse();

    return res.json({status:"success",data:cart});


     
  } catch (error) {
    return res.status(500).json({message:"Internal surver error"});
    
  }
})




module.exports=router;