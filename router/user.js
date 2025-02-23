const router=require("express").Router();
const User=require("../models/user");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {authenticateToken}=require("./userAuth")

//Sign Up
router.post("/sign-up",async (req,res)=>{
  try {
    const {username,email,password,address}=req.body;

    //check username length is more than 4
    if(username.length<4){
      return res.status(400).json({message:"Username length should be greater than 3"})
    }

    // username already exists
    const existingUserName=await User.findOne({username:username});
    if(existingUserName){
      return res.status(400).json({message:"Username already exists"});
    }
    const existingEmail=await User.findOne({email:email});
    if(existingEmail){
      return res.status(400).json({message:"Email already exists"});
    }
    //check password length
    if(password.length<=5){
      return res.status(400).json({message:"Password length should be grater than 5 "});
    }
    const hashPass= await bcrypt.hash(password,10);

    const newUser=new User({
      username:username,
      email:email,
      password:hashPass,
      address:address
    });
    await newUser.save();
    return  res.status(200).json({message:"sign up succesfully"});
    


    
  } catch (error) {
       res.status(500).json({message:"Internal server error"});
  }
});
//sign in
router.post("/sign-in",async (req,res)=>{

  try {
     const {username,password}=req.body
     const existingUser=await User.findOne({username:username})
     if(!existingUser){
       return res.status(400).json({message:"invalid credentials"});
     }
     await bcrypt.compare(password,existingUser.password,(err,data)=>{
        if(data){
          const authClaims=[
            {name:existingUser},{role:existingUser.role},
          ]
          const token=jwt.sign({authClaims},"bookStore123");
          res.status(200).json({id:existingUser._id,role:existingUser.role,token:token});
        }else{
          res.status(400).json({message:"invalid credentials"});
        }
     })
  } catch (error) {
     console.log("error",error)
      return res.status(500).json({message:"internal server error",data:error});
  }

});

//get user information

router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    // Find user by ID
    const data = await User.findById(id).select('-password');
    if (!data) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Respond with user data
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});

router.put("/update-address",authenticateToken,async(req,res)=>{

     try {
       const {id}=req.headers;
       const {address}=req.body;
       await User.findByIdAndUpdate(id,{address:address});
       return res.status(200).json({message:"address updated succesfully"});

      
     } catch (error) {
         res.status(500).json({message:"internal server error"});
     }


})





module.exports=router;