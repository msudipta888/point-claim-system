import  { useEffect, useMemo, useState } from 'react';
import { Zap, BarChart3 } from 'lucide-react';
import type{ User, PointHistory, LeaderboardEntry } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initialUsers } from './data/initialUsers';
import { UserSelector } from './components/UseSelector';
import { AddUserForm } from './components/AddUser';
import { ClaimButton } from './components/ClaimButton';
import { HistoryView } from './components/HistoryView';
import axios from 'axios';
import { useSocket } from './contextProvider/useSocket';
import { Leaderboard } from './components/LeaderBoard';


function App() {
  const [users, setUsers] = useLocalStorage<User[]>('users', initialUsers);
  const [history, setHistory] = useState<PointHistory[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [err,setErr] = useState("")
 const socket = useSocket();
  useEffect(() => {
    if (socket) {
        socket.on("calculate-rank", (data) => {
            setLeaderboardData(data);
        });
      socket.on("history-point",(data)=>{
        const historyEntry={
          userId:data.userId,
          points:data.point,
          userName:data.name,
         timestamp: Date.now()
        }
      setHistory(prev=>[historyEntry,...prev])

      })
        // Cleanup listener on unmount
        return () => {
            socket.off("calculate-rank");
            socket.off("history-point")
        };
    }
}, [socket]);

 const leaderboard: LeaderboardEntry[] = useMemo(() => {
    return leaderboardData.map((user, index) => ({
      userId: user.userId,
      name: user.name,
      totalPoints: user.totalPoints,
      rank: index + 1,
    }));
  }, [leaderboardData]);



 
  const userIds:string[] = ["111","123","343","122","555","233","788","1e4","787","s31","fg6","d4s","3sw","351","de4","4es","4r2s","4fe3ad"];
  const chooseUserIdRandomly = ()=>{
   const id = userIds[Math.floor(Math.random()*userIds.length)];
    return id;
  }
  const addUser =async (name: string, email: string) => {
    const userId = chooseUserIdRandomly();
   try {
    const addUsers = await axios.post("https://point-claim-system.onrender.com/add/user", {
      name,
      email,
      userId,
    });
    const newUser :User= {
      name,
      totalPoints:0,
      email,
      id:userId,
    };
     if(addUsers.status===201){
      setUsers(currentUsers => [...currentUsers, newUser]);
     } 
  } catch (error:unknown) {
    console.error("Error creating user:", error);
    let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else {
    message = String(error);
  }
  setErr(message);
    return null; 
  }
  };
  const allTotalPoints = leaderboardData.reduce((sum, user) => sum + user?.totalPoints, 0);
  const activeUsers = leaderboardData.filter(user => user.totalPoints > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              </div>
            </div>
          </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeUsers}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{allTotalPoints.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Points</p>
              </div>
            </div>
          </div>
         
        </div>
        {err && (
        <div className="mb-6 rounded bg-red-100 px-4 py-2 text-red-800 dark:bg-red-900 dark:text-red-200">
          {err}
        </div>
      )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - User Management */}
          <div className="space-y-6">
            <UserSelector
              users={users}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
            />
            
            <AddUserForm onAddUser={addUser} />
            
            <ClaimButton
              selectedUserId={selectedUserId}
            />
          </div>

          {/* Right Column - Leaderboard */}
          <div>
            <Leaderboard leaderboard={leaderboard} />
          </div>
        </div>

        {/* History Section - Full Width Below */}
        <div className="mt-8">
          <HistoryView history={history} />
        </div>
      </div>
    </div>
  );
}
export default App;
