
import React, { useState, useEffect } from 'react';

interface HangmanGameProps {
  onGameEnd: (score: number) => void;
}

export const HangmanGame: React.FC<HangmanGameProps> = ({ onGameEnd }) => {
  const words = ['JAVASCRIPT', 'REACT', 'TYPESCRIPT', 'NODEJS', 'PYTHON', 'CODING', 'DEVELOPER', 'PROGRAMMING'];
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  const maxWrongGuesses = 6;

  useEffect(() => {
    if (gameStarted) {
      setWord(words[Math.floor(Math.random() * words.length)]);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (word && gameStarted) {
      const wordGuessed = word.split('').every(letter => guessedLetters.includes(letter));
      if (wordGuessed) {
        setGameWon(true);
        setTimeout(() => onGameEnd(Math.max(0, 100 - wrongGuesses * 10)), 2000);
      }
    }
  }, [guessedLetters, word, gameStarted, wrongGuesses, onGameEnd]);

  useEffect(() => {
    if (wrongGuesses >= maxWrongGuesses) {
      setGameLost(true);
      setTimeout(() => onGameEnd(0), 2000);
    }
  }, [wrongGuesses, onGameEnd]);

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || gameWon || gameLost) return;
    
    setGuessedLetters(prev => [...prev, letter]);
    
    if (!word.includes(letter)) {
      setWrongGuesses(prev => prev + 1);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === ' ') {
          setGameStarted(true);
        }
        return;
      }

      if (gameWon || gameLost) return;

      if (e.key >= 'a' && e.key <= 'z') {
        handleGuess(e.key.toUpperCase());
      } else if (e.key >= 'A' && e.key <= 'Z') {
        handleGuess(e.key);
      } else if (e.key === 'q') {
        onGameEnd(0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameWon, gameLost, onGameEnd]);

  const displayWord = () => {
    return word.split('').map(letter => 
      guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
  };

  const hangmanParts = [
    '  +---+',
    '  |   |',
    '  |   O',
    '  |  /|\\',
    '  |  / \\',
    '  |',
    '========='
  ];

  const drawHangman = () => {
    const lines = ['  +---+', '  |   |'];
    
    if (wrongGuesses >= 1) lines.push('  |   O');
    else lines.push('  |');
    
    if (wrongGuesses >= 3) lines.push('  |  /|\\');
    else if (wrongGuesses >= 2) lines.push('  |   |');
    else lines.push('  |');
    
    if (wrongGuesses >= 4) lines.push('  |  / \\');
    else lines.push('  |');
    
    lines.push('  |');
    lines.push('=========');
    
    return lines.join('\n');
  };

  if (!gameStarted) {
    return (
      <div className="font-mono text-red-400">
        <div>🎯 HANGMAN</div>
        <div>━━━━━━━━━</div>
        <div></div>
        <div>Guess the programming word!</div>
        <div></div>
        <div>Controls:</div>
        <div>• Type letters to guess</div>
        <div>• Q to quit</div>
        <div></div>
        <div>Press SPACE to start!</div>
      </div>
    );
  }

  return (
    <div className="font-mono text-red-400">
      <div>🎯 HANGMAN | Wrong: {wrongGuesses}/{maxWrongGuesses} | {gameWon ? 'YOU WIN!' : gameLost ? 'GAME OVER!' : 'Playing'}</div>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <pre className="text-sm">{drawHangman()}</pre>
      <div></div>
      <div>Word: {displayWord()}</div>
      <div></div>
      <div>Guessed: {guessedLetters.join(', ')}</div>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      {gameWon && <div>Congratulations! You guessed the word!</div>}
      {gameLost && <div>Game Over! The word was: {word}</div>}
    </div>
  );
};
