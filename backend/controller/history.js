import { pointHistoryModel } from "../model/historyModel.js";

export const historyCollection =async(oldpoint,newpoint,user,userId)=>{
    // store in history collection
   const historyPointsCollection = await pointHistoryModel.findOneAndUpdate(
    {userId:userId},
    {
      $setOnInsert: {name: user.name},
      $push:{oldPoint:oldpoint},
      $set:{
        newPoint:newpoint,
        assignedAt: new Date()
      }
    },
    {
      new: true,
      upsert:true
    }
   )   
  return {
    id:userId,
    name:user.name,
    point: user.points
  }
}