const mongoose=require("mongoose");

const conn=async()=>{
  try {
    await mongoose.connect("mongodb://localhost:27017/BookStore");
    console.log("connected")
  } catch (error) {
     console.log(error);
  }
}
conn();