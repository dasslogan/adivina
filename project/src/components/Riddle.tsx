import React from 'react';

interface RiddleProps {
  text: string;
}

export const Riddle: React.FC<RiddleProps> = ({ text }) => {
  return (
    <div className="mb-8 bg-indigo-900 bg-opacity-60 rounded-xl p-6 shadow-lg border-2 border-indigo-700">
      <p className="text-2xl font-medium text-center italic text-white">
        "{text}"
      </p>
    </div>
  );
};