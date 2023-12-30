const asyncHandler = require("express-async-handler");
const User = require("../models/User.model");


const apiReqest = asyncHandler(async(req,res,next)=>{
    // console.log(req.user);
    if(!req.user){   
        return res.status(401).json({message:"User not Authorized!"})
    }
    // finding user in the database
    const user = await User.findById(req?.user?.id)
    if(!user){
        return res.status(404).json({message:"User not found!"})
    }
    let requestLimit = 0;
    // checking for the trial period...
    if(user?.isTrialActive){
        requestLimit = user?.monthlyRequestCount;
    }
    // checking for the user's monthly request exceeded or not
    if(user?.apiRequestCount >= 1){
        throw new Error("Opps... Request limit reached, Please Subscribe.")
    }
    next();
});

module.exports ={
    apiReqest,
}