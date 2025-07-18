export interface User {
  id: string;
  name: string;
  email:string;
  totalPoints: number
}

export interface PointHistory {
  userId: string;
  userName: string;
  points: number;
  timestamp: number;
}

export interface LeaderboardEntry  {
  userId:string;
  name:number;
  totalPoints:number;
  rank: number;
}