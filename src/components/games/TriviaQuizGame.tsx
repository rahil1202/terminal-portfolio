import React, { useState, useEffect } from 'react';

interface TriviaQuizProps {
  onGameEnd: (score: number) => void;
}

export const TriviaQuizGame: React.FC<TriviaQuizProps> = ({ onGameEnd }) => {
  const questions = [
    { q: 'What does CSS stand for?', a: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Sheets', 'Colorful Style Script'], correct: 0 },
    { q: 'Which language runs in a web browser?', a: ['Java', 'C++', 'JavaScript', 'Python'], correct: 2 },
    { q: 'What is the purpose of Git?', a: ['Database Management', 'Version Control', 'Web Hosting', 'Code Debugging'], correct: 1 },
    { q: 'What does API stand for?', a: ['Application Program Interface', 'Advanced Programming Interface', 'Automated Process Integration', 'App Processing Interface'], correct: 0 },
    { q: 'Which is a NoSQL database?', a: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'], correct: 2 }
  ];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    if (currentQuestion >= questions.length) {
      setGameWon(true);
      setTimeout(() => onGameEnd(score), 2000);
    }
  }, [currentQuestion, score, onGameEnd]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === ' ') setGameStarted(true);
        return;
      }
      if (gameWon) return;
      if (e.key >= '1' && e.key <= '4') {
        const answer = parseInt(e.key) - 1;
        if (answer === questions[currentQuestion].correct) {
          setScore(prev => prev + 20);
        }
        setCurrentQuestion(prev => prev + 1);
      } else if (e.key === 'q') {
        onGameEnd(score);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, gameStarted, gameWon, onGameEnd]);

  if (!gameStarted) {
    return (
      <div className="font-mono text-teal-400">
        <div>❓ TRIVIA QUIZ</div>
        <div>━━━━━━━━━━━━</div>
        <div></div>
        <div>Test your coding knowledge!</div>
        <div></div>
        <div>Controls:</div>
        <div>• Keys 1-4 to select answers</div>
        <div>• Q to quit</div>
        <div></div>
        <div>Press SPACE to start!</div>
      </div>
    );
  }

  return (
    <div className="font-mono text-teal-400">
      <div>❓ TRIVIA QUIZ | Score: {score} | Question {currentQuestion + 1}/{questions.length}</div>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      {!gameWon && (
        <>
          <div>{questions[currentQuestion].q}</div>
          <div></div>
          {questions[currentQuestion].a.map((answer, i) => (
            <div key={i}>{i + 1}. {answer}</div>
          ))}
          <div></div>
          <div>Press 1-4 to answer</div>
        </>
      )}
      {gameWon && (
        <>
          <div>Game Over! Final Score: {score}</div>
          <div>Press any key to return to terminal...</div>
        </>
      )}
    </div>
  );
};