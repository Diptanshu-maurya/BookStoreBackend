// const express = require("express");
// const router = express.Router(); 
const router=require("express").Router();
const User=require("../models/user");
const jwt=require("jsonwebtoken");
const {authenticateToken}=require("./userAuth");
const Book=require("../models/book");

//add book --admin

router.post("/add-book",authenticateToken,async (req,res)=>{
  
  try {
    const {id}=req.headers;
   const user= await User.findById(id);
   if(user.role!=="admin"){
        return res.status(400).json({message:"You are not access to admin "})
   }

    const book=new Book({
        url:req.body.url,
        title:req.body.title,
        author:req.body.author,
        price:req.body.price,
        desc:req.body.desc,
        language:req.body.language
    });
     await book.save();

     res.status(200).json({message:"New book added succesfully"});

    
  } catch (error) {
    res.status(500).json({message:"Intenal server error"});
  }
})

router.put("/update-book",authenticateToken,async (req,res)=>{
  try {
     const {bookid}=req.headers;
     await Book.findByIdAndUpdate(bookid,{
        url:req.body.url,
        title:req.body.title,
        author:req.body.author,
        price:req.body.price,
        desc:req.body.desc,
        language:req.body.language
     });
     return res.status(200).json({message:"book updated successfully"});
  } catch (error) {
    res.status(500).json({message:"Intenal server error"});
  }
})

router.delete("/delete-book",authenticateToken,async (req,res)=>{

    try {
       const {bookid}=req.headers;
       await Book.findByIdAndDelete(bookid);
       return res.status(200).json({message:"book deleted succesfull"}) 
    } catch (error) {
      res.status(500).json({message:"Intenal server error"});
    }

})

router.get("/get-all-books",async (req,res)=>{
    try {
       const book=await Book.find().sort({createdAt:-1});
       return res.status(200).json({message:"Success",data:book});
    } catch (error) {
      res.status(500).json({message:"Intenal server error"});
    }
})
router.get("/get-recent-books",async (req,res)=>{
  try {
     const book=await Book.find().sort({createdAt:-1}).limit(4);
     return res.status(200).json({message:"Success",data:book});
  } catch (error) {
    res.status(500).json({message:"Intenal server error"});
  }
})
router.get("/get-book-by-id/:id",async (req,res)=>{
   try {
      const {id}=req.params;
      const book=await Book.findById(id);
      return res.status(200).json({message:"success",data:book});
   } catch (error) {
    res.status(500).json({message:"Intenal server error"});
   }
})
// router.get("/get-book-by-id/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Validate the ID format
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ message: "Invalid book ID format" });
//     }

//     // Find the book by ID
//     const book = await Book.findById(id);

//     if (!book) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     // Return the book data
//     return res.status(200).json({ message: "success", data: book });
//   } catch (error) {
//     console.error("Error fetching book by ID:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });











module.exports=router;