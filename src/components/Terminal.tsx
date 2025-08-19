import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TerminalOutput } from './TerminalOutput';
import { TerminalInput } from './TerminalInput';
import { SnakeGame } from './games/SnakeGame';
import { Game2048 } from './games/Game2048';
import { GuessGame } from './games/GuessGame';
import { TicTacToeGame } from './games/TicTacToeGame';
import { MemoryGame } from './games/MemoryGame';
import { HangmanGame } from './games/HangmanGame';
import { TriviaQuizGame } from './games/TriviaQuizGame';
import { MinesweeperGame } from './games/MineSweeper';
import { MemoryMatchGame } from './games/MemoryMatch';
import { useTerminalCommands } from '../hooks/useTerminalCommands';
import { useTerminalHistory } from '../hooks/useTerminalHistory';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system';
  content: string | string[];
  timestamp: Date;
  prompt?: string;
}

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptUser, setPromptUser] = useState('rahil');
  const [promptLocation, setPromptLocation] = useState('~');
  const [liveUsers, setLiveUsers] = useState(Math.floor(Math.random() * 10) + 1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { executeCommand, getCommandSuggestion, currentTheme, isLoading, matrixRain, handleInterrupt, currentDirectory, gameMode, setGameMode } = useTerminalCommands();
  const { addToHistory, navigateHistory, getHistory } = useTerminalHistory();

  useEffect(() => {
    if (currentDirectory === '/home/rahil') {
      setPromptLocation('~');
    } else {
      const pathParts = currentDirectory.split('/');
      setPromptLocation(pathParts[pathParts.length - 1] || '~');
    }
  }, [currentDirectory]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(Math.floor(Math.random() * 10) + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const addLine = useCallback((content: string | string[], type: TerminalLine['type'] = 'output', prompt?: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date(),
      prompt
    };
    setLines(prev => [...prev, newLine]);
  }, []);

  const bootSequence = useCallback(async () => {
    const bootMessages = [
      'Portfolio Terminal v0.1.0 ready.',
      '',
      '██████╗  █████╗ ██╗  ██╗██╗██╗     ',
      '██╔══██╗██╔══██╗██║  ██║██║██║     ',
      '██████╔╝███████║███████║██║██║     ',
      '██╔══██╗██╔══██║██╔══██║██║██║     ',
      '██║  ██║██║  ██║██║  ██║██║███████╗',
      '╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝',
      '',
      'Welcome to Rahil\'s Interactive Developer Terminal',
      'File system initialized at /home/rahil',
      'Type `help` to explore available commands',
      'Type `ls` to see available files and directories',
      ''
    ];

    for (let i = 0; i < bootMessages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, i < 6 ? 300 : 100));
      addLine(bootMessages[i], 'system');
    }

    setIsBooting(false);
    setShowPrompt(true);
  }, [addLine]);

  useEffect(() => {
    bootSequence();
  }, [bootSequence]);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  useEffect(() => {
    if (inputRef.current && showPrompt) {
      inputRef.current.focus();
    }
  }, [showPrompt]);

  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    const prompt = `${promptUser}@${promptLocation}:~$`;
    addLine(`${prompt} ${command}`, 'input', prompt);
    addToHistory(command);
    
    if (command.toLowerCase() === 'clear') {
      setLines([]);
      return;
    }

    if (command.toLowerCase() === 'exit') {
      addLine('logout', 'system');
      addLine('Session ended. Thank you for visiting!', 'system');
      setShowPrompt(false);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    }

    const result = await executeCommand(command, getHistory());
    
    if (result === '__CLEAR_TERMINAL__') {
      setLines([]);
      return;
    }
    
    if (typeof result === 'string' && result.match(/^(snake|2048|guess|tictactoe|memory|hangman|trivia|minesweeper|memorymatch)$/)) {
      setGameMode(result);
      setShowPrompt(false);
      return;
    }
    
    if (Array.isArray(result)) {
      result.forEach(line => addLine(line, 'output'));
    } else {
      addLine(result, 'output');
    }
  };

  const handleGameEnd = (score?: number) => {
    if (score !== undefined) {
      addLine(`Game ended! Final score: ${score}`, 'system');
    } else {
      addLine('Game ended!', 'system');
    }
    setGameMode(null);
    setShowPrompt(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      handleInterrupt();
      setCurrentInput('');
      addLine('^C', 'system');
    } else if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const historyCommand = navigateHistory('up');
      if (historyCommand !== null) {
        setCurrentInput(historyCommand);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const historyCommand = navigateHistory('down');
      if (historyCommand !== null) {
        setCurrentInput(historyCommand);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const suggestion = getCommandSuggestion(currentInput);
      if (suggestion) {
        setCurrentInput(suggestion);
      }
    }
  };

  const handleTerminalClick = () => {
    if (inputRef.current && showPrompt) {
      inputRef.current.focus();
    }
  };

  if (gameMode) {
    return (
      <div className={`fixed inset-0 ${currentTheme.bg} ${currentTheme.text} font-mono text-sm z-50`}>
        <div className="h-full w-full flex items-center justify-center p-4">
          <div className="w-full h-full max-w-4xl max-h-full flex items-center justify-center">
            {gameMode === 'snake' && <SnakeGame onGameEnd={handleGameEnd} />}
            {gameMode === '2048' && <Game2048 onGameEnd={handleGameEnd} />}
            {gameMode === 'guess' && <GuessGame onGameEnd={() => handleGameEnd()} />}
            {gameMode === 'tictactoe' && <TicTacToeGame onGameEnd={() => handleGameEnd()} />}
            {gameMode === 'memory' && <MemoryGame onGameEnd={handleGameEnd} />}
            {gameMode === 'hangman' && <HangmanGame onGameEnd={handleGameEnd} />}
            {gameMode === 'trivia' && <TriviaQuizGame onGameEnd={handleGameEnd} />}
            {gameMode === 'minesweeper' && <MinesweeperGame onGameEnd={handleGameEnd} />}
            {gameMode === 'memorymatch' && <MemoryMatchGame onGameEnd={handleGameEnd} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`h-full ${currentTheme.bg} ${currentTheme.text} font-mono text-sm overflow-hidden cursor-text transition-colors duration-300 relative`}
      onClick={handleTerminalClick}
    >
      <div className={`absolute top-4 right-4 ${currentTheme.accent} px-3 py-1 rounded-md text-xs font-bold z-20`}>
        💻 Live Users: {liveUsers}
      </div>
      {matrixRain && (
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <div className="matrix-rain h-full w-full">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute text-green-400 text-xs animate-pulse"
                style={{ left: `${(i * 2) % 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: '2s' }}
              >
                {[...Array(20)].map((_, j) => (
                  <div key={j} className="mb-1">{String.fromCharCode(0x30A0 + Math.random() * 96)}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      <div ref={terminalRef} className="h-full overflow-y-auto p-4 pb-12 pt-8" style={{ scrollBehavior: 'smooth' }}>
        {lines.map((line) => (
          <TerminalOutput key={line.id} content={line.content} type={line.type} prompt={line.prompt} theme={currentTheme} />
        ))}
        {isLoading && (
          <div className={`${currentTheme.text} flex items-center space-x-2`}>
            <span>Loading</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}
        {showPrompt && !isBooting && (
          <TerminalInput
            ref={inputRef}
            value={currentInput}
            onChange={setCurrentInput}
            onKeyDown={handleKeyDown}
            prompt={`${promptUser}@${promptLocation}:~$`}
            theme={currentTheme}
          />
        )}
      </div>
    </div>
  );
};

export default Terminal;