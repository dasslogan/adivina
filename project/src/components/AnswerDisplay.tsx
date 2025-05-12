import React from 'react';

interface AnswerDisplayProps {
  revealedAnswer: string;
}

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ revealedAnswer }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-lg p-4 shadow-lg">
        {revealedAnswer.split('').map((char, index) => (
          <span 
            key={index}
            className={`inline-block text-3xl font-bold mx-1 w-10 text-center py-2 border-b-4 border-purple-900 ${
              char !== '_' ? 'text-purple-900 animate-bounce' : 'text-transparent'
            }`}
            style={{ 
              animationDuration: char !== '_' ? '0.5s' : '0s',
              animationDelay: `${index * 0.05}s`,
              animationIterationCount: '1'
            }}
          >
            {char !== '_' ? char : '_'}
          </span>
        ))}
      </div>
    </div>
  );
};