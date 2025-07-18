import React, { useState } from 'react';
import { History, ChevronLeft, ChevronRight, User, TrendingUp, Clock, Award } from 'lucide-react';
import type { PointHistory } from '../types';

interface HistoryViewProps {
  history: PointHistory[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
console.log('history:',history)
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);
  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = sortedHistory.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPointsColor = (points: number) => {
    if (points >= 80) return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
    if (points >= 60) return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    if (points >= 40) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
            <History className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Point History</h2>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          {history.length} total claims
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedHistory.map((entry, index) => (
          <div
            key={index}
            className="group bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getPointsColor(entry.points)}`}>
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {entry.userName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(entry.timestamp)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getPointsColor(entry.points)}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{entry.points}
                </div>
              </div>
            </div>
            
            <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  entry.points >= 80 ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                  entry.points >= 60 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                  entry.points >= 40 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  'bg-gradient-to-r from-orange-400 to-orange-600'
                }`}
                style={{ width: `${entry.points*10} %` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {history.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <History className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium">No history available</p>
          <p className="text-sm">Start claiming points to see your history here!</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, history.length)} of {history.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-gray-700 dark:text-gray-300"
            > 
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-lg font-medium">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-gray-700 dark:text-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};