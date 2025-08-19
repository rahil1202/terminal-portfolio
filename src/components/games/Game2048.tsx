
import React, { useState, useEffect, useCallback } from 'react';

interface Game2048Props {
  onGameEnd: (score: number) => void;
}

type Board = number[][];

export const Game2048: React.FC<Game2048Props> = ({ onGameEnd }) => {
  const [board, setBoard] = useState<Board>(() => initializeBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  function initializeBoard(): Board {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }

  function addRandomTile(board: Board) {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  const moveLeft = useCallback((currentBoard: Board) => {
    const newBoard = currentBoard.map(row => [...row]);
    let moved = false;
    let newScore = 0;

    for (let i = 0; i < 4; i++) {
      const row = newBoard[i].filter(val => val !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          newScore += row[j];
          row[j + 1] = 0;
        }
      }
      const filteredRow = row.filter(val => val !== 0);
      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }
      
      if (JSON.stringify(newBoard[i]) !== JSON.stringify(filteredRow)) {
        moved = true;
      }
      newBoard[i] = filteredRow;
    }

    return { board: newBoard, moved, score: newScore };
  }, []);

  const rotateBoard = (board: Board): Board => {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newBoard[j][3 - i] = board[i][j];
      }
    }
    return newBoard;
  };

  const move = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    let currentBoard = [...board];
    let rotations = 0;

    switch (direction) {
      case 'right':
        rotations = 2;
        break;
      case 'up':
        rotations = 3;
        break;
      case 'down':
        rotations = 1;
        break;
    }

    for (let i = 0; i < rotations; i++) {
      currentBoard = rotateBoard(currentBoard);
    }

    const { board: movedBoard, moved, score: roundScore } = moveLeft(currentBoard);

    for (let i = 0; i < (4 - rotations) % 4; i++) {
      currentBoard = rotateBoard(movedBoard);
    }

    if (moved) {
      addRandomTile(currentBoard);
      setBoard(currentBoard);
      setScore(prev => prev + roundScore);
      
      // Check for win condition (2048)
      const hasWon = currentBoard.some(row => row.some(cell => cell === 2048));
      if (hasWon) {
        setGameOver(true);
      }
    }
  }, [board, gameOver, moveLeft]);

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
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        case 'q':
          setGameOver(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move, gameStarted]);

  const renderBoard = () => {
    return board.map(row => 
      row.map(cell => 
        cell === 0 ? '    ·' : cell.toString().padStart(5, ' ')
      ).join('|')
    ).join('\n');
  };

  if (!gameStarted) {
    return (
      <div className="font-mono text-cyan-400">
        <div>🎮 2048 GAME</div>
        <div>━━━━━━━━━━━</div>
        <div></div>
        <div>Controls:</div>
        <div>• Arrow keys to move tiles</div>
        <div>• Q to quit</div>
        <div>• Combine tiles to reach 2048!</div>
        <div></div>
        <div>Press SPACE to start!</div>
      </div>
    );
  }

  return (
    <div className="font-mono text-cyan-400">
      <div>🎮 2048 | Score: {score} | {gameOver ? 'GAME OVER' : 'Playing'}</div>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <pre className="text-sm leading-tight">{renderBoard()}</pre>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      {gameOver && <div>Press any key to return to terminal...</div>}
    </div>
  );
};
