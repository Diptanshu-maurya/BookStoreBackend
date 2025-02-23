const router=require("express").Router();
const User=require("../models/user");
const jwt=require("jsonwebtoken");
const {authenticateToken}=require("./userAuth");
const Book=require("../models/book");


router.put("/add-book-to-fav", authenticateToken, async (req, res) => {
  try {
      const { bookid, id } = req.headers;

      // Ensure 'id' and 'bookid' are provided
      if (!id || !bookid) {
          return res.status(400).json({ message: "User ID and Book ID are required" });
      }

      // Retrieve user data and populate the favourites field
      const userData = await User.findById(id);

      // Check if user exists
      if (!userData) {
          return res.status(404).json({ message: "User not found" });
      }

      // Ensure the 'favourites' field exists as an array
      if (!Array.isArray(userData.favourites)) {
          return res.status(500).json({ message: "Favourites field is missing or invalid" });
      }

      // Check if book is already in favourites
      if (userData.favourites.includes(bookid)) {
          return res.status(200).json({ message: "Book is already in favourites" });
      }

      // Add book to favourites
      await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });

      return res.status(200).json({ message: "Book added to favourites successfully" });

  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/remove-book-from-fav", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    if (!id || !bookid) {
      return res.status(400).json({ message: "User ID and Book ID are required" });
    }

    const userData = await User.findById(id);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!userData.favourites.includes(bookid)) {
      return res.status(400).json({ message: "Book is not in favourites" });
    }

    await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });

    return res.status(200).json({ message: "Book removed from favourites successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/get-fav-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;  // ✅ Corrected header extraction

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userData = await User.findById(id).populate("favourites");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Success", data: userData.favourites });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});





module.exports=router;