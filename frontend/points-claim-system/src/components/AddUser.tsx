import React, { useState } from 'react';
import { Plus, X, UserPlus } from 'lucide-react';

interface AddUserFormProps {
  onAddUser: (name: string,email:string) => void;
}

export const AddUserForm: React.FC<AddUserFormProps> = ({ onAddUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email,setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // send request to backend axios
   // const userId =chooseUserIdRandomly();
    if (name.trim() && email.trim()) {
      onAddUser(name.trim(),email.trim());
      setName('');
      setEmail('')
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setEmail('');
    setIsOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-xl">
          <UserPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add User</h2>
      </div>

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-green-400 dark:hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 group"
        >
          <Plus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
          Add New User
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter user name..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
          </div>
          <div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={!name.trim()&& !email.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white py-3 px-4 rounded-xl font-medium disabled:cursor-not-allowed transition-colors duration-200"
            >
              Add User
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="p-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}; 