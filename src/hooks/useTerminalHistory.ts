
import { useState, useCallback } from 'react';

export const useTerminalHistory = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addToHistory = useCallback((command: string) => {
    setHistory(prev => {
      const newHistory = [...prev.filter(cmd => cmd !== command), command];
      return newHistory.slice(-50); // Keep last 50 commands
    });
    setCurrentIndex(-1);
  }, []);

  const navigateHistory = useCallback((direction: 'up' | 'down'): string | null => {
    if (history.length === 0) return null;

    let newIndex;
    if (direction === 'up') {
      newIndex = currentIndex === -1 ? history.length - 1 : Math.max(0, currentIndex - 1);
    } else {
      newIndex = currentIndex === -1 ? -1 : Math.min(history.length - 1, currentIndex + 1);
      if (newIndex === history.length - 1 && currentIndex === history.length - 1) {
        newIndex = -1;
      }
    }

    setCurrentIndex(newIndex);
    return newIndex === -1 ? '' : history[newIndex];
  }, [history, currentIndex]);

  const getCurrentHistoryIndex = useCallback(() => currentIndex, [currentIndex]);

  const getHistory = useCallback(() => history, [history]);

  return { addToHistory, navigateHistory, getCurrentHistoryIndex, getHistory };
};
