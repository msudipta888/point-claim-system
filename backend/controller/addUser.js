import { userModel } from "../model/userModel.js";

export const addUser = async(req,res)=>{
const {userId,name,email} = req.body;
if(!userId || !name || !email){
    return res.status(400).json({message:"Please fill in all fields"});
}
const checkIsPresent = await userModel.findOne({userId:userId});
if(checkIsPresent){
    return res.status(400).json({message:"User already exists"});
    }else{
        const user = new userModel({
         userId:userId,
         name:name,
         email:email,
         points:0,
         totalPoints:0
        });
        await user.save();
        return res.status(201).json({message:"User created successfully"});
}
}
