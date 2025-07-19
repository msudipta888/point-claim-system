import { userModel } from "../model/userModel.js";
import { historyCollection } from "./history.js";

const randomPoint = ()=>{
let randomPoint = Math.floor(Math.random(1)*10);
console.log('random point:',randomPoint)
return randomPoint
}
export const assignPoint = async(userId)=>{
   try {
    const user = await userModel.findOne({userId:userId});
     if (!user) throw new Error("User not found");

  let newpoint = randomPoint();
   let oldpoint = user.points || 0;
  

   user.points=newpoint;
   user.totalPoints+=newpoint;
    await user.updateOne({
    $set:{
        points:user.points,
        totalPoints:user.totalPoints
    }
   })
  const historyPoint = await historyCollection(oldpoint,newpoint,user,userId)
   
    const newPoint= {
        userId,
        name: user.name,
        point: user.points,
        totalPoints:user.totalPoints,
        historyPoint
    }
    return newPoint;
   } catch (error) {
    console.error('error:',error);
    throw new Error(error)
   }
}
