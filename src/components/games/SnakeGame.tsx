
import React, { useState, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onGameEnd: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onGameEnd }) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const BOARD_SIZE = 20;

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

      // Check wall collision
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood({
          x: Math.floor(Math.random() * BOARD_SIZE),
          y: Math.floor(Math.random() * BOARD_SIZE)
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver]);

  useEffect(() => {
    if (!gameStarted) return;
    
    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [moveSnake, gameStarted]);

  useEffect(() => {
    if (gameOver) {
      onGameEnd(score);
    }
  }, [gameOver, score, onGameEnd]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === ' ') {
          setGameStarted(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case 'q':
          setGameOver(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted]);

  const renderBoard = () => {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill('·'));
    
    // Place snake
    snake.forEach((segment, index) => {
      if (segment.x >= 0 && segment.x < BOARD_SIZE && segment.y >= 0 && segment.y < BOARD_SIZE) {
        board[segment.y][segment.x] = index === 0 ? '█' : '▓';
      }
    });
    
    // Place food
    if (food.x >= 0 && food.x < BOARD_SIZE && food.y >= 0 && food.y < BOARD_SIZE) {
      board[food.y][food.x] = '●';
    }
    
    return board.map(row => row.join(' ')).join('\n');
  };

  if (!gameStarted) {
    return (
      <div className="font-mono text-green-400">
        <div>🐍 SNAKE GAME</div>
        <div>━━━━━━━━━━</div>
        <div></div>
        <div>Controls:</div>
        <div>• Arrow keys to move</div>
        <div>• Q to quit</div>
        <div></div>
        <div>Press SPACE to start!</div>
      </div>
    );
  }

  return (
    <div className="font-mono text-green-400">
      <div>🐍 SNAKE | Score: {score} | {gameOver ? 'GAME OVER' : 'Playing'}</div>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <pre className="text-xs leading-tight">{renderBoard()}</pre>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      {gameOver && <div>Press any key to return to terminal...</div>}
    </div>
  );
};
