import React, { useState, useEffect } from 'react';
import { Riddle } from './Riddle';
import { Timer } from './Timer';
import { AnswerDisplay } from './AnswerDisplay';
import { Leaderboard } from './Leaderboard';
import { ConnectionStatus } from './ConnectionStatus';
import { useWebSocket } from '../hooks/useWebSocket';
import { useGameLogic } from '../hooks/useGameLogic';
import { Player } from '../types';

export const Game: React.FC = () => {
  const [gameState, setGameState] = useState<'waiting' | 'active' | 'finished'>('waiting');
  const [players, setPlayers] = useState<Player[]>([]);
  
  const { 
    isConnected, 
    lastMessage,
    connectionStatus
  } = useWebSocket();
  
  const {
    currentRiddle,
    revealedAnswer,
    timeRemaining,
    correctPlayers,
    startGame,
    resetGame,
    processGuess,
    revealNextLetter
  } = useGameLogic();

  // Handle incoming chat messages
  useEffect(() => {
    if (!lastMessage || !gameState || gameState !== 'active') return;
    
    try {
      const parsedMessage = JSON.parse(lastMessage);
      
      if (parsedMessage.event === 'chat') {
        const { uniqueId, comment, nickname } = parsedMessage.data;
        
        // Check if the comment starts with the operator "."
        if (comment.startsWith('.')) {
          const guess = comment.substring(1).trim().toLowerCase();
          processGuess(uniqueId, nickname, guess);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }, [lastMessage, gameState, processGuess]);

  // Reveal a new letter every 30 seconds
  useEffect(() => {
    if (gameState !== 'active') return;
    
    const interval = setInterval(() => {
      if (timeRemaining > 0 && timeRemaining % 30 === 0) {
        revealNextLetter();
      }
      
      if (timeRemaining <= 0) {
        setGameState('finished');
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeRemaining, gameState, revealNextLetter]);

  const handleStartGame = () => {
    startGame();
    setGameState('active');
  };

  const handleResetGame = () => {
    resetGame();
    setGameState('waiting');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ConnectionStatus status={connectionStatus} />
      
      <div className="bg-purple-800 bg-opacity-80 rounded-lg shadow-2xl p-6 mb-6">
        {gameState === 'waiting' && (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold mb-6">¡Bienvenidos al Juego de Adivinanzas!</h2>
            <p className="text-xl mb-8">Prepárate para resolver adivinanzas en el chat usando el prefijo "."</p>
            <button 
              onClick={handleStartGame}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              disabled={!isConnected || !currentRiddle}
            >
              {!isConnected 
                ? 'Conectando...' 
                : !currentRiddle 
                  ? 'No hay adivinanzas disponibles' 
                  : 'Iniciar Juego'}
            </button>
          </div>
        )}
        
        {gameState === 'active' && currentRiddle && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Adivinanza</h2>
              <Timer seconds={timeRemaining} />
            </div>
            <Riddle text={currentRiddle.question} />
            <AnswerDisplay revealedAnswer={revealedAnswer} />
          </>
        )}
        
        {gameState === 'finished' && (
          <div className="text-center py-6">
            <h2 className="text-3xl font-bold mb-4">¡Tiempo Terminado!</h2>
            <p className="text-xl mb-2">La respuesta correcta era:</p>
            <p className="text-2xl font-bold text-yellow-300 mb-6">{currentRiddle?.answer}</p>
            <button 
              onClick={handleResetGame}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
            >
              Nueva Ronda
            </button>
          </div>
        )}
      </div>
      
      {(gameState === 'finished' || gameState === 'active') && (
        <Leaderboard players={correctPlayers} title="Top Jugadores" />
      )}
    </div>
  );
};