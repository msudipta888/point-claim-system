import React from 'react';
import { ChevronDown, User as UserIcon, Users } from 'lucide-react';
import type { User } from '../types';

interface UserSelectorProps {
  users: User[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUserId,
  onSelectUser,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl">
          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select User</h2>
      </div>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm pl-4 pr-10 py-4 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500"
        >
          <span className="flex items-center">
            <UserIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
            <span className="block truncate text-gray-900 dark:text-white">
              {selectedUser ? selectedUser.name : 'Choose a user...'}
            </span>
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown 
              className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 shadow-2xl max-h-60 rounded-xl py-2 text-base ring-1 ring-black ring-opacity-5 dark:ring-gray-600 overflow-auto focus:outline-none border border-gray-200 dark:border-gray-700">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  onSelectUser(user.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150 ${
                  selectedUserId === user.id 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300' 
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{user.name}</span>
                  {/* <span className="text-sm text-gray-500 dark:text-gray-400">
                    {user.totalPoints} pts
                  </span> */}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};