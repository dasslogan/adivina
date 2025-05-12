import React, { useEffect, useState } from 'react';

interface TimerProps {
  seconds: number;
}

export const Timer: React.FC<TimerProps> = ({ seconds }) => {
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    // Calculate percentage based on 2 minutes (120 seconds)
    const percentage = (seconds / 120) * 100;
    setProgress(percentage);
  }, [seconds]);
  
  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Determine color based on remaining time
  const getColorClass = () => {
    if (progress > 66) return 'bg-green-500';
    if (progress > 33) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="w-36">
      <div className="flex justify-between mb-1">
        <span className="text-xl font-bold">{formatTime(seconds)}</span>
      </div>
      <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColorClass()} transition-all duration-1000 ease-linear`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};