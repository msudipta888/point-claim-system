# 🏆 Real-Time Points & Leaderboard System

A full-stack real-time ranking and points assignment system using **MongoDB**, **Socket.IO**, and **REST API**. This project allows user creation via API, point assignment (random between 1–10), and dynamically updates a real-time leaderboard with history tracking.

## 🚀 Tech Stack

### 🧠 Backend
- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **Socket.IO** (for real-time communication)
- REST API endpoints for user management and point assignment

### 💻 Frontend
- **Vite** + **React** (with **TypeScript**)
- Socket.IO Client (for real-time updates)

---

## 📂 Features

- 🔗 **REST API** to:
  - Add new users to the database
  - Assign random points (1 to 10) to a user
- 📡 **Socket.IO** for:
  - Real-time leaderboard updates
  - Broadcasting point assignments
  - Displaying user point history
- 🧾 **MongoDB Models**:
  - `UserModel`: stores user ID, name, current points, and total points
  - `HistoryModel`: stores old and new points each time a user is assigned points
- 📈 **Real-Time Leaderboard**:
  - Dynamically updates whenever a new point is assigned
  - Sorted by total points
- 🧠 **Validation**:
  - Verifies valid users before assigning points
  - Tracks and logs history for each point change

---

## 🛠️ Installation & Setup

### 1. Clone the repository

    ```bash
        git clone https://github.com/msudipta888/point-claim-system.git
        
        cd backend
        npm install
        MONGODB_URI=mongodb://localhost:27017/point_system
        PORT=8000
        Start backend Server:
           npm run dev
        Fronted:
          cd ../frontend/points-claim-system
          npm install
          npm run dev

API ENDPOINT: 
   POST /add/user : To add new user
 Socket Connection Endpoint:
    calculate-rank: show dynamic ledearboard
    history-point: for real time history collection show
    



