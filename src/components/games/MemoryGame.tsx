
import React, { useState, useEffect } from 'react';

interface MemoryGameProps {
  onGameEnd: (score: number) => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onGameEnd }) => {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const symbols = ['♠', '♣', '♥', '♦', '★', '♪', '☀', '☽'];

  useEffect(() => {
    if (gameStarted) {
      const shuffledCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched(prev => [...prev, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length === 16 && gameStarted) {
      setGameWon(true);
    }
  }, [matched, gameStarted]);

  useEffect(() => {
    if (gameWon) {
      setTimeout(() => onGameEnd(Math.max(0, 100 - moves)), 2000);
    }
  }, [gameWon, moves, onGameEnd]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === ' ') {
          setGameStarted(true);
        }
        return;
      }

      if (gameWon) return;

      switch (e.key) {
        case 'ArrowLeft':
          setSelectedIndex(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          setSelectedIndex(prev => Math.min(15, prev + 1));
          break;
        case 'ArrowUp':
          setSelectedIndex(prev => Math.max(0, prev - 4));
          break;
        case 'ArrowDown':
          setSelectedIndex(prev => Math.min(15, prev + 4));
          break;
        case 'Enter':
          if (flipped.length < 2 && !flipped.includes(selectedIndex) && !matched.includes(selectedIndex)) {
            setFlipped(prev => [...prev, selectedIndex]);
          }
          break;
        case 'q':
          onGameEnd(0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameWon, selectedIndex, flipped, matched, onGameEnd]);

  const renderBoard = () => {
    const rows = [];
    for (let i = 0; i < 4; i++) {
      const cells = [];
      for (let j = 0; j < 4; j++) {
        const index = i * 4 + j;
        const isFlipped = flipped.includes(index) || matched.includes(index);
        const isSelected = selectedIndex === index;
        const cell = isFlipped ? cards[index] : '?';
        cells.push(isSelected ? `[${cell}]` : ` ${cell} `);
      }
      rows.push(cells.join(' '));
    }
    return rows.join('\n');
  };

  if (!gameStarted) {
    return (
      <div className="font-mono text-purple-400">
        <div>🧠 MEMORY GAME</div>
        <div>━━━━━━━━━━━━</div>
        <div></div>
        <div>Match all pairs of symbols!</div>
        <div></div>
        <div>Controls:</div>
        <div>• Arrow keys to move cursor</div>
        <div>• Enter to flip card</div>
        <div>• Q to quit</div>
        <div></div>
        <div>Press SPACE to start!</div>
      </div>
    );
  }

  return (
    <div className="font-mono text-purple-400">
      <div>🧠 MEMORY GAME | Moves: {moves} | Matched: {matched.length}/16 | {gameWon ? 'YOU WIN!' : 'Playing'}</div>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <pre className="text-lg leading-relaxed">{renderBoard()}</pre>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      {gameWon && <div>Congratulations! Final score: {Math.max(0, 100 - moves)}</div>}
    </div>
  );
};
