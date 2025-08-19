import React, { useState, useEffect } from 'react';

interface MemoryMatchProps {
  onGameEnd: (score: number) => void;
}

export const MemoryMatchGame: React.FC<MemoryMatchProps> = ({ onGameEnd }) => {
  const [cards, setCards] = useState<string[]>(() => {
    const symbols = ['★', '●', '■', '▲', '▼', '◆', '♥', '♠'];
    return [...symbols, ...symbols].sort(() => Math.random() - 0.5);
  });
  const [revealed, setRevealed] = useState<boolean[]>(Array(16).fill(false));
  const [firstCard, setFirstCard] = useState<number | null>(null);
  const [matched, setMatched] = useState<boolean[]>(Array(16).fill(false));
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (matched.every(Boolean)) {
      setGameWon(true);
      setTimeout(() => onGameEnd(Math.max(0, 100 - moves)), 2000);
    }
  }, [matched, moves, onGameEnd]);

  const handleCardSelect = (index: number) => {
    if (revealed[index] || matched[index] || gameWon || firstCard === index) return;
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
    setMoves(prev => prev + 1);

    if (firstCard === null) {
      setFirstCard(index);
    } else {
      if (cards[firstCard] === cards[index]) {
        const newMatched = [...matched];
        newMatched[firstCard] = newMatched[index] = true;
        setMatched(newMatched);
        setFirstCard(null);
      } else {
        setTimeout(() => {
          const resetRevealed = [...newRevealed];
          resetRevealed[firstCard] = resetRevealed[index] = false;
          setRevealed(resetRevealed);
          setFirstCard(null);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === ' ') setGameStarted(true);
        return;
      }
      if (gameWon) return;
      if (e.key >= '1' && e.key <= '9' || e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'b') {
        const index = e.key.toLowerCase() === 'a' ? 9 : e.key.toLowerCase() === 'b' ? 10 : parseInt(e.key) - 1;
        handleCardSelect(index);
      } else if (e.key === 'q') {
        onGameEnd(0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [firstCard, gameStarted, gameWon]);

  const renderBoard = () => {
    const rows = [];
    for (let i = 0; i < 4; i++) {
      const row = cards.slice(i * 4, (i + 1) * 4).map((card, j) => {
        const index = i * 4 + j;
        return matched[index] || revealed[index] ? card.padEnd(2) : '■'.padEnd(2);
      }).join(' ');
      rows.push(row);
    }
    return rows.join('\n');
  };

  if (!gameStarted) {
    return (
      <div className="font-mono text-pink-400">
        <div>🧠 MEMORY MATCH</div>
        <div>━━━━━━━━━━━━━━</div>
        <div></div>
        <div>Match all pairs!</div>
        <div></div>
        <div>Controls:</div>
        <div>• Keys 1-9, A-B to select cards</div>
        <div>• Q to quit</div>
        <div></div>
        <div>Press SPACE to start!</div>
      </div>
    );
  }

  return (
    <div className="font-mono text-pink-400">
      <div>🧠 MEMORY MATCH | Moves: {moves} | {gameWon ? 'YOU WIN!' : 'Playing'}</div>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <pre className="text-sm">{renderBoard()}</pre>
      <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      {!gameWon && <div>Press 1-9, A-B to flip a card</div>}
      {gameWon && <div>Press any key to return to terminal...</div>}
    </div>
  );
};