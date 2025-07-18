import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { addUserRoute } from './router/userRoute.js';
import { Server } from 'socket.io';
import {createServer} from 'http'
import { assignPoint } from './controller/point.js';
import mongoose from 'mongoose';
import { userModel } from './model/userModel.js';
import { historyCollection } from './controller/history.js';

const app = express();
app.use(express.json());

const httpServer = createServer(app)
app.use(cors({
    origin:"*"
}))
const io = new Server(httpServer,{
    cors:{
        origin: "http://localhost:5173",
        credentials:true
    }
})

const PORT = process.env.PORT;

const connetDb = async()=>{
    await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>console.log('connected with database')).catch((err)=>console.error('error found:',err))
}

connetDb();

// add user
app.use("/add",addUserRoute);

io.on("connection",(socket)=>{
    console.log(`user connected via socket: ${socket.id}`);


    // Handle claim-button event - moved out of calculate-ranking
    socket.on("claim-button", async(data, callback) => {
        console.log('claim-button event received:', data);
        
        try {
            const { userId } = data;
            
            if (!userId) {
                const error = 'User ID is required';
                console.error(error);
                if (callback) callback({ success: false, error });
                return;
            }

            const claimPoint = await assignPoint(userId);
            const historypointCollection = claimPoint.historyPoint
            console.log('Points assigned successfully:', claimPoint);
            
            // Send response back via callback
            if (callback) {
                callback({
                    success: true,
                    points: claimPoint.point,
                    totalPoints: claimPoint.totalPoints,
                    userId: claimPoint.userId,
                    name: claimPoint.name
                });
            }
            
            // Also emit to all clients for real-time updates
             const user = await userModel.find();
            const sortedTotalPoints = [...user]
                .filter(user => user.totalPoints > 0)
                .sort((a,b) => b.totalPoints - a.totalPoints);
            io.emit('points-updated', {
                userId: claimPoint.userId,
                points: claimPoint.point,
            });
            io.emit('calculate-rank',sortedTotalPoints);
           
            io.emit("history-point",historypointCollection)
        } catch (error) {
            console.error('Error claiming points:', error);
            if (callback) {
                callback({ 
                    success: false, 
                    error: error.message || 'Failed to claim points' 
                });
            }
        }
    });

    socket.on("disconnect", () => {
        console.log('User disconnected:', socket.id);
    });
})

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})