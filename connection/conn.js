const mongoose=require("mongoose");
require("dotenv").config();

const conn=async()=>{
  try {
    await mongoose.connect(process.env.CONNECTION_URL);
    console.log("connected")
  } catch (error) {
     console.log(error);
  }
}
conn();