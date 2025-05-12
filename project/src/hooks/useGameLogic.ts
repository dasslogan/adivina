import { useState, useEffect, useCallback } from 'react';
import { Riddle, Player } from '../types';
import { fetchRandomRiddle } from '../services/apiService';
import { savePlayerScore } from '../services/apiService';

export function useGameLogic() {
  const [currentRiddle, setCurrentRiddle] = useState<Riddle | null>(null);
  const [revealedAnswer, setRevealedAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [gameActive, setGameActive] = useState(false);
  const [correctPlayers, setCorrectPlayers] = useState<Player[]>([]);
  const [revealCount, setRevealCount] = useState(0);
  
  // Load a random riddle
  const loadRandomRiddle = useCallback(async () => {
    try {
      const riddle = await fetchRandomRiddle();
      if (!riddle) {
        throw new Error('No riddle received from server');
      }
      
      // Check if we received an error response
      if ('error' in riddle) {
        throw new Error(riddle.error);
      }
      
      setCurrentRiddle(riddle);
      
      // Initialize the revealed answer with underscores
      setRevealedAnswer('_'.repeat(riddle.answer.length));
    } catch (error) {
      console.error('Error loading riddle:', error);
      // Add more specific error handling here if needed
    }
  }, []);
  
  // Initialize the game
  useEffect(() => {
    loadRandomRiddle();
  }, [loadRandomRiddle]);
  
  // Start the game
  const startGame = useCallback(() => {
    if (!currentRiddle) return;
    
    setGameActive(true);
    setTimeRemaining(120);
    setCorrectPlayers([]);
    setRevealCount(0);
    
    // Initialize the revealed answer with underscores
    setRevealedAnswer('_'.repeat(currentRiddle.answer.length));
    
    // Start the timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentRiddle]);
  
  // Reset the game
  const resetGame = useCallback(() => {
    setGameActive(false);
    setTimeRemaining(120);
    setCorrectPlayers([]);
    loadRandomRiddle();
  }, [loadRandomRiddle]);
  
  // Process a player's guess
  const processGuess = useCallback((playerId: string, nickname: string, guess: string) => {
    if (!gameActive || !currentRiddle) return;
    
    // Check if the player has already guessed correctly
    const playerAlreadyGuessed = correctPlayers.some(player => player.id === playerId);
    if (playerAlreadyGuessed) return;
    
    // Check if the guess is correct (case insensitive)
    const isCorrect = guess.toLowerCase() === currentRiddle.answer.toLowerCase();
    
    if (isCorrect) {
      const newPlayer: Player = {
        id: playerId,
        nickname,
        guessTime: Date.now() - (120 - timeRemaining) * 1000, // Calculate time taken
        correctAnswers: 1
      };
      
      setCorrectPlayers(prev => [...prev, newPlayer]);
      
      // Save the player score to the database
      savePlayerScore(newPlayer).catch(error => {
        console.error('Error saving player score:', error);
      });
    }
  }, [gameActive, currentRiddle, correctPlayers, timeRemaining]);
  
  // Reveal the next letter of the answer
  const revealNextLetter = useCallback(() => {
    if (!currentRiddle || revealCount >= currentRiddle.answer.length) return;
    
    const answerArray = revealedAnswer.split('');
    let revealed = false;
    
    // Find the next unrevealed letter
    while (!revealed && revealCount < currentRiddle.answer.length) {
      const randomIndex = Math.floor(Math.random() * currentRiddle.answer.length);
      
      if (answerArray[randomIndex] === '_') {
        answerArray[randomIndex] = currentRiddle.answer[randomIndex];
        revealed = true;
        setRevealCount(prev => prev + 1);
      }
    }
    
    setRevealedAnswer(answerArray.join(''));
  }, [currentRiddle, revealedAnswer, revealCount]);
  
  return {
    currentRiddle,
    revealedAnswer,
    timeRemaining,
    correctPlayers,
    startGame,
    resetGame,
    processGuess,
    revealNextLetter
  };
}