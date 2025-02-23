const express=require("express");
const app=express();
require("dotenv").config();
require("./connection/conn");
const cors=require("cors");
const user=require("./router/user");
const book=require("./router/book")
const favourite=require("./router/favourite")
const cart=require("./router/cart")
const order=require("./router/order");
app.use(express.json())
app.use(cors());

app.use("/api/v1",user);
app.use("/api/v1",book);
app.use("/api/v1",favourite);
app.use("/api/v1",cart);
app.use("/api/v1",order);

// app.get("/",(req,res)=>{
//   res.send("hello from backend");
// })

app.listen(process.env.PORT,()=>{
  console.log("server started");
});
