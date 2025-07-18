import mongoose from "mongoose";

const historyPointSchema = new mongoose.Schema({
    userId:{
        type: String,
        required:true,
        index:true
    },
    name:{
        type:String,
        required:true
    },
    oldPoint:{
        type:[Number],
        default:[]
    },
    newPoint:{
        type:Number
    },
      assignedAt: {
        type: Date,
        default: Date.now
    }
})

export const pointHistoryModel = mongoose.model('historyPointSchema',historyPointSchema);