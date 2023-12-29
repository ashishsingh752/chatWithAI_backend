const express = require("express");
const userRouter = require("./routes/user.route");


const app = express();
const PORT = process.env.PORT || 3000;

  
//----Routes---
app.use('/api/v1/users', userRouter);




app.listen(PORT, ()=>console.log(`server is Live at ${PORT}`))