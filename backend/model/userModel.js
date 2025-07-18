import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId:{
      type: String,
      required:true
    },
   name:{
    type: String,
    required: true
   },
   email:{
    type: String,
    required: true,
    unique: true
    },
    points:{
        type:Number,
        default: 0
    },
    totalPoints:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

export const userModel = mongoose.model('userSchema',userSchema);
