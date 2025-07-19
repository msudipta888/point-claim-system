import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Crown } from 'lucide-react';
import type { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard }) => {
  const [animatingUsers, setAnimatingUsers] = useState<Set<string>>(new Set());
  const [previousLeaderboard, setPreviousLeaderboard] = useState<LeaderboardEntry[]>([]);



  useEffect(() => {
    const changedUsers = new Set<string>();
    
    leaderboard.forEach((current) => {
      const previous = previousLeaderboard.find(p => p.userId === current.userId);
      if (!previous  || previous.rank !== current.rank) {
        changedUsers.add(current.userId);
      }
    });

    if (changedUsers.size > 0) {
      setAnimatingUsers(changedUsers);
      setTimeout(() => setAnimatingUsers(new Set()), 2000);
    }

    setPreviousLeaderboard(leaderboard);
  }, [leaderboard, previousLeaderboard]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-7 w-7 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
            {rank}
          </div>
        );
    }
  };

  const getRankStyle = (rank: number, isAnimating: boolean) => {
    const baseClasses = "transition-all duration-500 hover:scale-105";
    const animationClasses = isAnimating ? "animate-pulse ring-4 ring-blue-400 dark:ring-blue-500" : "";
    
    switch (rank) {
      case 1:
        return `${baseClasses} ${animationClasses} bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-2 border-yellow-300 dark:border-yellow-600 shadow-lg`;
      case 2:
        return `${baseClasses} ${animationClasses} bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border-2 border-gray-300 dark:border-gray-600 shadow-md`;
      case 3:
        return `${baseClasses} ${animationClasses} bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-2 border-amber-300 dark:border-amber-600 shadow-md`;
      default:
        return `${baseClasses} ${animationClasses} bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-sm`;
    }
  };

  const getPointsChangeIndicator = (userId: string) => {
    if (animatingUsers.has(userId)) {
      return (
        <div className="flex items-center space-x-1 text-green-500 dark:text-green-400">
          <TrendingUp className="h-4 w-4 animate-bounce" />
          <span className="text-xs font-medium">+</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
          <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Leaderboard</h2>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.map((entry,ind) => {
          const isAnimating = animatingUsers.has(entry.userId);
          return (
            <div
              key={ind}
              className={`p-4 rounded-xl ${getRankStyle(entry.rank, isAnimating)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getRankIcon(entry.rank)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        {entry.name}
                      </h3>
                      {getPointsChangeIndicator(entry.userId)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Rank #{entry.rank}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <p className={`text-3xl font-bold ${
                      entry.rank === 1 ? 'text-yellow-600 dark:text-yellow-400' :
                      entry.rank === 2 ? 'text-gray-600 dark:text-gray-400' :
                      entry.rank === 3 ? 'text-amber-500 dark:text-amber-500' :
                      'text-blue-600 dark:text-blue-400'
                    }`}>
                      {
                        entry.totalPoints.toString()
                      }
                    </p>
                    {isAnimating && (
                      <div className="flex flex-col items-center">
                        <TrendingUp className="h-5 w-5 text-green-500 animate-bounce" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">points</p>
                </div>
              </div>
              
              {entry.rank <= 3 && (
                <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      entry.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      entry.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                      'bg-gradient-to-r from-sky-400 to-amber-600'
                    }`}
                    style={{ 
                      width: `${Math.min(100, (entry.totalPoints / Math.max(...leaderboard.map(l => l.totalPoints))) * 100)}%` 
                    }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium">No points claimed yet</p>
          <p className="text-sm">Be the first to claim points and top the leaderboard!</p>
        </div>
      )}
    </div>
  );
};
