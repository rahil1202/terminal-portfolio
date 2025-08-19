
import React, { useState, useEffect } from 'react';

interface TicTacToeGameProps {
  onGameEnd: (score?: number) => void;
}

export const TicTacToeGame: React.FC<TicTacToeGameProps> = ({ onGameEnd }) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(0);

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (board: string[]) => {
    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes('') ? null : 'tie';
  };

  const makeMove = (position: number) => {
    if (board[position] || winner) return;
    
    const newBoard = [...board];
    newBoard[position] = currentPlayer;
    setBoard(newBoard);
    
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
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

      if (winner) {
        onGameEnd();
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          setSelectedPosition(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          setSelectedPosition(prev => Math.min(8, prev + 1));
          break;
        case 'ArrowUp':
          setSelectedPosition(prev => Math.max(0, prev - 3));
          break;
        case 'ArrowDown':
          setSelectedPosition(prev => Math.min(8, prev + 3));
          break;
        case 'Enter':
          makeMove(selectedPosition);
          break;
        case 'q':
          onGameEnd();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, winner, selectedPosition, onGameEnd]);

  const renderBoard = () => {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const cells = [];
      for (let j = 0; j < 3; j++) {
        const index = i * 3 + j;
        const cell = board[index] || ' ';
        const isSelected = selectedPosition === index;
        cells.push(isSelected ? `[${cell}]` : ` ${cell} `);
      }
      rows.push(cells.join('|'));
    }
    return rows.join('\n---|---|---\n');
  };

  if (!gameStarted) {
    return (
      <div className="font-mono text-blue-400">
        <div>⭕ TIC TAC TOE</div>
        <div>━━━━━━━━━━━━</div>
        <div></div>
        <div>Play against the computer!</div>
        <div></div>
        <div>Controls:</div>
        <div>• Arrow keys to move cursor</div>
        <div>• Enter to place X/O</div>
        <div>• Q to quit</div>
        <div></div>
        <div>Press SPACE to start!</div>
      </div>
    );
  }

  return (
    <div className="font-mono text-blue-400">
      <div>⭕ TIC TAC TOE | Player: {currentPlayer} | {winner ? (winner === 'tie' ? 'TIE GAME!' : `${winner} WINS!`) : 'Playing'}</div>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <pre className="text-lg leading-relaxed">{renderBoard()}</pre>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      {winner && <div>Press any key to return to terminal...</div>}
    </div>
  );
};
