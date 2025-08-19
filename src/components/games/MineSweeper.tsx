import React, { useState, useEffect } from 'react';

interface MinesweeperProps {
  onGameEnd: (score: number) => void;
}

export const MinesweeperGame: React.FC<MinesweeperProps> = ({ onGameEnd }) => {
  const boardSize = 9;
  const mineCount = 10;
  const [board, setBoard] = useState<string[][] | null>(null); // Board initialized after first move
  const [revealed, setRevealed] = useState<boolean[][]>(
    Array(boardSize).fill(null).map(() => Array(boardSize).fill(false))
  );
  const [flagged, setFlagged] = useState<boolean[][]>(
    Array(boardSize).fill(null).map(() => Array(boardSize).fill(false))
  );
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [flagsUsed, setFlagsUsed] = useState(0);
  const [time, setTime] = useState(0);
  const [inputMode, setInputMode] = useState<'row' | 'col' | 'action' | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);

  function initializeBoard(firstX: number, firstY: number): string[][] {
    const newBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill('0'));
    let mines = 0;
    while (mines < mineCount) {
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);
      if (newBoard[x][y] !== 'M' && !(x === firstX && y === firstY)) {
        newBoard[x][y] = 'M';
        mines++;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && newBoard[nx][ny] !== 'M') {
              newBoard[nx][ny] = (parseInt(newBoard[nx][ny]) + 1).toString();
            }
          }
        }
      }
    }
    return newBoard;
  }

  const revealCell = (x: number, y: number) => {
    if (x < 0 || x >= boardSize || y < 0 || y >= boardSize || revealed[x][y] || flagged[x][y] || gameOver || gameWon) return;
    if (!board) {
      setBoard(initializeBoard(x, y));
      setMoves(prev => prev + 1);
    }
    const currentBoard = board || initializeBoard(x, y);
    const newRevealed = [...revealed.map(row => [...row])];
    newRevealed[x][y] = true;
    setRevealed(newRevealed);

    if (currentBoard[x][y] === 'M') {
      setGameOver(true);
      return;
    }

    if (currentBoard[x][y] === '0') {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          revealCell(x + dx, y + dy);
        }
      }
    }

    const revealedCount = newRevealed.flat().filter(Boolean).length;
    const flaggedMines = flagged.flat().filter((f, i) => f && currentBoard[Math.floor(i / boardSize)][i % boardSize] === 'M').length;
    if (revealedCount === boardSize * boardSize - mineCount || flaggedMines === mineCount) {
      setGameWon(true);
    }
  };

  const toggleFlag = (x: number, y: number) => {
    if (x < 0 || x >= boardSize || y < 0 || y >= boardSize || revealed[x][y] || gameOver || gameWon) return;
    const newFlagged = [...flagged.map(row => [...row])];
    newFlagged[x][y] = !newFlagged[x][y];
    setFlagged(newFlagged);
    setFlagsUsed(prev => prev + (newFlagged[x][y] ? 1 : -1));
    setMoves(prev => prev + 1);

    const flaggedMines = newFlagged.flat().filter((f, i) => f && (board || initializeBoard(x, y))[Math.floor(i / boardSize)][i % boardSize] === 'M').length;
    if (flaggedMines === mineCount) {
      setGameWon(true);
    }
  };

  const resetGame = () => {
    setBoard(null);
    setRevealed(Array(boardSize).fill(null).map(() => Array(boardSize).fill(false)));
    setFlagged(Array(boardSize).fill(null).map(() => Array(boardSize).fill(false)));
    setGameOver(false);
    setGameWon(false);
    setMoves(0);
    setFlagsUsed(0);
    setTime(0);
    setInputMode(null);
    setSelectedRow(null);
    setSelectedCol(null);
    setGameStarted(true);
  };

  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) return;
    const timer = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, gameWon]);

  useEffect(() => {
    if (gameOver || gameWon) {
      const score = gameWon ? Math.max(0, 100 + (boardSize * boardSize - mineCount) * 10 - time - moves * 2) : 0;
      setTimeout(() => onGameEnd(score), 2000);
    }
  }, [gameOver, gameWon, time, moves, onGameEnd]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === ' ') {
          setGameStarted(true);
          setInputMode('row');
        }
        return;
      }
      if (gameOver || gameWon) {
        if (e.key === 'r') resetGame();
        else onGameEnd(gameWon ? Math.max(0, 100 + (boardSize * boardSize - mineCount) * 10 - time - moves * 2) : 0);
        return;
      }

      if (inputMode === 'row' && e.key >= '1' && e.key <= '9') {
        setSelectedRow(parseInt(e.key) - 1);
        setInputMode('col');
      } else if (inputMode === 'col' && e.key >= '1' && e.key <= '9') {
        setSelectedCol(parseInt(e.key) - 1);
        setInputMode('action');
      } else if (inputMode === 'action') {
        if (e.key.toLowerCase() === 'r') {
          revealCell(selectedRow!, selectedCol!);
          setInputMode('row');
          setSelectedRow(null);
          setSelectedCol(null);
        } else if (e.key.toLowerCase() === 'f') {
          toggleFlag(selectedRow!, selectedCol!);
          setInputMode('row');
          setSelectedRow(null);
          setSelectedCol(null);
        }
      } else if (e.key === 'q') {
        onGameEnd(0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, gameWon, inputMode, selectedRow, selectedCol]);

  const renderBoard = () => {
    const currentBoard = board || Array(boardSize).fill(null).map(() => Array(boardSize).fill('0'));
    return currentBoard.map((row, i) =>
      row.map((cell, j) => {
        if (flagged[i][j]) return '🚩'.padEnd(2);
        if (!revealed[i][j]) return '■'.padEnd(2);
        return (cell === 'M' ? '💣' : cell === '0' ? '·' : cell).padEnd(2);
      }).join(' ')
    ).join('\n');
  };

  if (!gameStarted) {
    return (
      <div className="font-mono text-purple-400 p-4 bg-black bg-opacity-60 border border-pink-500 border-opacity-40 rounded-lg shadow-lg shadow-pink-500/20">
        <div className="text-cyan-300 text-lg">💣 MINESWEEPER</div>
        <div className="border-t border-pink-500 my-2"></div>
        <div className="text-sm">Objective: Reveal all safe cells, avoid {mineCount} mines!</div>
        <div></div>
        <div className="text-yellow-300">Controls:</div>
        <div>• 1-9 to select row, then column</div>
        <div>• R to reveal, F to flag/unflag</div>
        <div>• Q to quit, R to restart after game</div>
        <div></div>
        <div className="text-cyan-300 animate-pulse">Press SPACE to start!</div>
      </div>
    );
  }

  return (
    <div className="font-mono text-purple-400 p-4 bg-black bg-opacity-60 border border-pink-500 border-opacity-40 rounded-lg shadow-lg shadow-pink-500/20">
      <div className="text-cyan-300 text-lg">
        💣 MINESWEEPER | Moves: {moves} | Flags: {flagsUsed}/{mineCount} | Time: {time}s | {gameWon ? 'YOU WIN!' : gameOver ? 'GAME OVER!' : 'Playing'}
      </div>
      <div className="border-t border-pink-500 my-2"></div>
      <pre className="text-sm leading-tight">
        {renderBoard().split('\n').map((row, i) => (
          <div key={i}>
            {row.split(' ').map((cell, j) => (
              <span key={j} className={
                cell.includes('🚩') ? 'text-yellow-300' :
                cell.includes('💣') ? 'text-red-400' :
                cell.includes('·') ? 'text-gray-400' :
                cell.includes('■') ? 'text-purple-400' : 'text-cyan-300'
              }>
                {cell}
              </span>
            ))}
          </div>
        ))}
      </pre>
      <div className="border-t border-pink-500 my-2"></div>
      {!gameOver && !gameWon && (
        <div className="text-sm">
          {inputMode === 'row' && <div className="text-cyan-300 animate-pulse">Enter row (1-9): _</div>}
          {inputMode === 'col' && <div className="text-cyan-300 animate-pulse">Enter column (1-9): _</div>}
          {inputMode === 'action' && <div className="text-cyan-300 animate-pulse">Press R to reveal, F to flag: _</div>}
        </div>
      )}
      {(gameOver || gameWon) && (
        <div className="text-sm">
          <div className="text-yellow-300 animate-pulse">
            {gameWon ? `You won! Score: ${Math.max(0, 100 + (boardSize * boardSize - mineCount) * 10 - time - moves * 2)}` : 'Game Over!'}
          </div>
          <div>Press R to restart or any key to return to terminal...</div>
        </div>
      )}
    </div>
  );
};