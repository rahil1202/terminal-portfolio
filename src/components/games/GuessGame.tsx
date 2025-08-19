
import React, { useState, useEffect } from 'react';

interface GuessGameProps {
  onGameEnd: () => void;
}

export const GuessGame: React.FC<GuessGameProps> = ({ onGameEnd }) => {
  const [targetNumber, setTargetNumber] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === ' ') {
          setGameStarted(true);
        }
        return;
      }

      if (gameWon) {
        onGameEnd();
        return;
      }

      if (e.key === 'Enter' && guess.trim()) {
        const guessNum = parseInt(guess);
        setAttempts(prev => prev + 1);
        
        if (guessNum === targetNumber) {
          setFeedback(`🎉 Correct! You guessed it in ${attempts + 1} attempts!`);
          setGameWon(true);
        } else if (guessNum < targetNumber) {
          setFeedback(`📈 Too low! Try a higher number.`);
        } else {
          setFeedback(`📉 Too high! Try a lower number.`);
        }
        setGuess('');
      } else if (e.key === 'q') {
        onGameEnd();
      } else if (e.key >= '0' && e.key <= '9') {
        setGuess(prev => prev + e.key);
      } else if (e.key === 'Backspace') {
        setGuess(prev => prev.slice(0, -1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [guess, attempts, targetNumber, gameWon, onGameEnd, gameStarted]);

  if (!gameStarted) {
    return (
      <div className="font-mono text-yellow-400">
        <div>🎯 NUMBER GUESSING GAME</div>
        <div>━━━━━━━━━━━━━━━━━━━━━━</div>
        <div></div>
        <div>I'm thinking of a number between 1 and 100!</div>
        <div></div>
        <div>Controls:</div>
        <div>• Type numbers and press Enter to guess</div>
        <div>• Q to quit</div>
        <div></div>
        <div>Press SPACE to start!</div>
      </div>
    );
  }

  return (
    <div className="font-mono text-yellow-400">
      <div>🎯 GUESS THE NUMBER (1-100)</div>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <div>Attempts: {attempts}</div>
      <div></div>
      {feedback && <div>{feedback}</div>}
      <div></div>
      {!gameWon && (
        <div>
          <div>Your guess: {guess}_</div>
          <div></div>
          <div>Type a number and press Enter!</div>
        </div>
      )}
      {gameWon && <div>Press any key to return to terminal...</div>}
    </div>
  );
};
