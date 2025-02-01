const router=require("express").Router();
const User=require("../models/user");
const jwt=require("jsonwebtoken");
const {authenticateToken}=require("./userAuth");
const Book=require("../models/book");


router.put("/add-book-to-fav",authenticateToken, async(req,res)=>{
    try {
        const {bookid,id}=req.headers;
        const userData=User.findById(id);
        const isBookFav=userData.favourites.includes(bookid);
        if(isBookFav){
          return res.status(200).json({message:"book is already in favourites"});
        }
        await User.findByIdAndUpdate(id,{$push:{favourites:bookid}});
        return res.status(200).json({message:"book added to favourites succesfully"});


    } catch (error) {
       return res.status(500).json({message:"Internal server error"});
    }
})
router.put("/remove-book-from-fav",authenticateToken, async(req,res)=>{
  try {
      const {bookid,id}=req.headers;
      const userData=User.findById(id);
      const isBookFav=userData.favourites.includes(bookid);
      if(isBookFav){
        await User.findByIdAndUpdate(id,{$pull:{favourites:bookid}});
        return res.status(200).json({message:"book removed from favourites succesfully"});
      }
      


  } catch (error) {
     return res.status(500).json({message:"Internal server error"});
  }
})

router.get("/get-fav-bookd",authenticateToken,async (req,res)=>{
   try {
    const {id}=headers.id;
    const userData=await User.findById(id).populate("favourites");
    const favouriteBooks=userData.favourites;
    return res.status(200).json({message:"Success",data:favouriteBooks})
   } catch (error) {
    
   }
});




module.exports=router;