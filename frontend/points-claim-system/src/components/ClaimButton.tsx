import React, { useState } from 'react';
import { Gift, Sparkles, Zap } from 'lucide-react';
import { useSocket } from '@/contextProvider/useSocket';

interface ClaimButtonProps {
  selectedUserId: string | null;
  disabled?: boolean;
}

export const ClaimButton: React.FC<ClaimButtonProps> = ({
  selectedUserId,
  disabled = false,
}) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [lastPoints, setLastPoints] = useState<number | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const socket = useSocket();
  // No longer needed since we're using callback pattern
  // useEffect removed

  const handleClaim = async () => {
    // Validation checks
    if (!selectedUserId) {
      return;
    }
    
    if (isClaiming) {
      return;
    }

    if (!socket) {
      return;
    }

    setIsClaiming(true);
    
    try {
      // Emit the claim request with timeout and callback
      socket.timeout(5000).emit("claim-button", {
        userId: selectedUserId
      }, (err:any, response:any) => {
        if (err) {
          console.error('Socket timeout or error:', err);
          setIsClaiming(false);
          return;
        }
        
        console.log('Claim response received:', response);
        
        if (response?.success && response?.points) {
          setLastPoints(response.points);
          setShowAnimation(true);
          setTimeout(() => setShowAnimation(false), 3000);
        } else {
          console.error('Claim failed:', response?.error || 'Unknown error');
        }
        
        setIsClaiming(false);
      });
      
      
    } catch (error) {
      console.error('Error sending claim request:', error);
      setIsClaiming(false);
    }
  };

  const isDisabled = disabled || !selectedUserId || isClaiming;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-xl">
          <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Claim Points</h2>
      </div>

      <div className="space-y-4">
        {/* Debug info - remove in production */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Selected User: {selectedUserId || 'None'}</p>
          <p>Socket Connected: {socket ? 'Yes' : 'No'}</p>
          <p>Is Claiming: {isClaiming ? 'Yes' : 'No'}</p>
        </div>

        <button
          onClick={handleClaim}
          disabled={isDisabled}
          className={`
            relative w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform
            ${isDisabled
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            {isClaiming ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Claiming...</span>
              </>
            ) : (
              <>
                <Gift className="h-5 w-5" />
                <span>Claim Random Points</span>
              </>
            )}
          </div>
        </button>

        {showAnimation && lastPoints && (
          <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 animate-bounce bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <Sparkles className="h-6 w-6" />
            <span className="text-xl font-bold">+ {lastPoints} points!</span>
            <Sparkles className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
};