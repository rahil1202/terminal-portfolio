import { useState, useCallback } from 'react';
import { themes } from '../data/themes';
import { portfolioCommands } from '../data/commands/portfolioCommands';
import { projectUrls } from '@/data/projectUrls';
import { systemCommands } from '../data/commands/systemCommands';
import { gameCommands } from '../data/commands/gameCommands'; 
import { funCommands } from '../data/commands/funCommands';
import { themeCommands } from '../data/commands/themeCommands';
import { useFileSystem, FileSystemItem } from './useFileSystem';

interface Theme {
  bg: string;
  text: string;
  prompt: string;
  accent: string;
}

export const useTerminalCommands = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.matrix);
  const [isLoading, setIsLoading] = useState(false);
  const [matrixRain, setMatrixRain] = useState(false);
  const [glitchMode, setGlitchMode] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('/home/rahil');
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [funMode, setFunMode] = useState(false);
  const [sudoMode, setSudoMode] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const { fileSystem, findItem } = useFileSystem(); 
  const [activeContext, setActiveContext] = useState<string | null>(null);

  const handleInterrupt = useCallback(() => {
    setIsLoading(false);
    setMatrixRain(false);
    setGameMode(null);
    setGlitchMode(false);
  }, []);

  const commands = {
    ...portfolioCommands,
    ...systemCommands,
    ...gameCommands,
    ...funCommands,
    ...themeCommands,
    help: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setGlitchMode: (mode: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: Theme) => void) => {
      const baseCommands = {
        'help': 'Show available commands',
        'portfolio': 'View my portfolio',
        'about': 'Learn about me',
        'contact': 'Get contact info',
        'whoami': 'Display current user information',
        'games': 'List available games',
        'fun-zone': 'Enter fun mode with special commands',
        'theme': 'Change terminal theme',
        'weather': 'Get current weather information',
        'ls': 'List directory contents',
        'cd': 'Change directory',
        'cat': 'Display file contents'
      };

      const helpLines = ['AVAILABLE COMMANDS', '=================', ''];
      for (const [cmd, desc] of Object.entries(baseCommands)) {
        helpLines.push(`• ${cmd} - ${desc}`);
      }

      if (activeContext === 'games') {
        helpLines.push('', '🎮 AVAILABLE GAMES', '=================', '');
        Object.keys(gameCommands).forEach(cmd => helpLines.push(`• ${cmd} - ${getCommandInfo(cmd) || 'Play this game'}`));
        helpLines.push('', '🎮 GAME CONTROLS', '===============', '• Press Q to quit any game', '• Use arrow keys for movement in supported games');
      } else if (activeContext === 'portfolio') {
        helpLines.push('', '📋 PORTFOLIO COMMANDS', '====================', '');
        Object.keys(portfolioCommands).forEach(cmd => helpLines.push(`• ${cmd} - ${getCommandInfo(cmd) || 'View portfolio details'}`));
      } else if (activeContext === 'theme') {
        helpLines.push('', '🌈 THEME COMMANDS', '================', '');
        Object.keys(themeCommands).forEach(cmd => helpLines.push(`• ${cmd} - ${getCommandInfo(cmd) || 'Change terminal theme'}`));
      } else if (funMode) {
        helpLines.push('', '🎉 FUN ZONE COMMANDS', '=================', '');
        Object.keys(funCommands).forEach(cmd => helpLines.push(`• ${cmd} - ${getCommandInfo(cmd) || 'Have some fun'}`));
      }

      helpLines.push('', '💡 Navigation tips: Use ↑/↓ for history, Tab for autocompletion, Ctrl+C to interrupt', '');
      return helpLines;
    },
    games: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setGlitchMode: (mode: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: Theme) => void) => {
      setActiveContext('games');
      return [
        '🎮 AVAILABLE GAMES',
        '=================',
        '',
        ...Object.keys(gameCommands).map(cmd => `• ${cmd} - ${getCommandInfo(cmd) || 'Play this game'}`),
        '',
        '🎮 GAME CONTROLS',
        '===============',
        '• Press Q to quit any game',
        '• Use arrow keys for movement in supported games',
        ''
      ];
    },
    portfolio: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setGlitchMode: (mode: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: Theme) => void) => {
      setActiveContext('portfolio');
      return [
        '📋 PORTFOLIO COMMANDS',
        '====================',
        '',
        ...Object.keys(portfolioCommands).map(cmd => `• ${cmd} - ${getCommandInfo(cmd) || 'View portfolio details'}`),
        ''
      ];
    },
    theme: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setGlitchMode: (mode: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: Theme) => void) => {
      setActiveContext('theme');
      const themeList = Object.keys(themes).map(themeName => `theme-${themeName}`);
      return [
        '🌈 THEME COMMANDS',
        '================',
        '',
        ...themeList.map(cmd => `• ${cmd} - ${getCommandInfo(cmd) || 'Change to this theme'}`),
        ''
      ];
    },
    weather: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setGlitchMode: (mode: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: Theme) => void) => ['Weather: 72°F (22°C), Partly Cloudy in San Francisco'],
    ls: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setGlitchMode: (mode: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: Theme) => void) => {
      const pathParts = currentDirectory.split('/').filter(part => part);
      const currentDir = findItem(pathParts) || fileSystem;
      const items = currentDir.children || [];
      if (items.length === 0) return ['Directory is empty.'];
      return [
        'Directory listing:',
        ...items.map(item => `${item.type === 'directory' ? '[DIR]' : '[FILE]'} ${item.name}`),
        ''
      ];
    },
    cd: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setGlitchMode: (mode: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: Theme) => void) => {
      const newPath = args[0] || '';
      if (newPath === '..') {
        const pathParts = currentDirectory.split('/').filter(part => part);
        if (pathParts.length > 1) pathParts.pop();
        setCurrentDirectory(`/home/rahil/${pathParts.join('/')}`);
        return `Changed directory to /home/rahil/${pathParts.join('/') || 'rahil'}`;
      } else if (newPath) {
        const fullPath = `${currentDirectory}/${newPath}`.replace('//', '/');
        const pathParts = fullPath.split('/').filter(part => part);
        const target = findItem(pathParts);
        if (target && target.type === 'directory') {
          setCurrentDirectory(fullPath);
          return `Changed directory to ${fullPath}`;
        }
        return `cd: ${newPath}: No such directory`;
      }
      return 'Usage: cd <directory> or cd .. to go up';
    },
    cat: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setGlitchMode: (mode: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: Theme) => void) => {
      if (!args[0]) return 'Usage: cat <filename>';
      const fullPath = `${currentDirectory}/${args[0]}`.replace('//', '/');
      const pathParts = fullPath.split('/').filter(part => part);
      const item = findItem(pathParts);
      if (item && item.type === 'file' && item.content) {
        return item.content.split('\n').map(line => line.trim()).filter(line => line);
      }
      return `cat: ${args[0]}: No such file or directory`;
    }
  };

  const getCommandInfo = (cmd: string) => {
    const descriptions = {
      'help': 'Show available commands',
      'portfolio': 'View my portfolio',
      'about': 'Learn about me',
      'contact': 'Get contact info',
      'whoami': 'Display current user information',
      'games': 'List available games',
      'fun-zone': 'Enter fun mode with special commands',
      'ascii': 'View ASCII art gallery',
      'theme': 'Change terminal theme',
      'weather': 'Get current weather information',
      'ls': 'List directory contents',
      'cd': 'Change directory',
      'cat': 'Display file contents',
      'theme-matrix': 'Switch to matrix theme',
      'theme-solarized': 'Switch to solarized theme',
      'theme-dracula': 'Switch to dracula theme',
      'theme-hacker': 'Switch to hacker theme',
      'theme-cyberpunk': 'Switch to cyberpunk theme',
      'theme-monokai': 'Switch to monokai theme',
      'theme-nord': 'Switch to nord theme',
      'theme-terminal-classic': 'Switch to terminal classic theme',
      'theme-whiteout': 'Switch to whiteout theme',
      'theme-abyss': 'Switch to abyss theme',
      'theme-ocean': 'Switch to ocean theme',
      'theme-forest': 'Switch to forest theme',
      'theme-sunset': 'Switch to sunset theme',
      'theme-neon': 'Switch to neon theme',
      'theme-pastel': 'Switch to pastel theme',
      'theme-midnight': 'Switch to midnight theme',
      'theme-retro': 'Switch to retro theme',
      'theme-arctic': 'Switch to arctic theme',
      'theme-lava': 'Switch to lava theme',
      'theme-twilight': 'Switch to twilight theme',
      'game-snake': 'Play Snake game',
      'game-2048': 'Play 2048 game',
      'game-guess': 'Play Guess game',
      'game-tictactoe': 'Play Tic Tac Toe game',
      'game-memory': 'Play Memory game',
      'game-hangman': 'Play Hangman game',
      'game-trivia': 'Play Trivia game',
      'game-minesweeper': 'Play Minesweeper game',
      'game-memorymatch': 'Play Memory Match game',
      'rain': 'Trigger matrix rain effect',
      'hack': 'Simulate a hacking process',
      'debugging-simulator': 'Run a debugging simulation',
      'deploy-war': 'Simulate a git deployment war',
      'sudo boot': 'Simulate a system reboot',
      'sudo random': 'Open a random website',
      'dice': 'Roll a six-sided die',
      'quote': 'Display a random quote',
      'fortune': 'Display a random fortune'
    };
    return descriptions[cmd] || 'Description not available';
  };

  const executeCommand = useCallback((cmd: string, history: string[]): string | string[] => {
    const [command, ...args] = cmd.trim().toLowerCase().split(' ');
    if (command === 'exit-fun') {
      setFunMode(false);
      setSudoMode(false);
      setActiveContext(null);
      return 'Exited fun zone and all contexts. Back to main menu! 💼';
    }

    if (command === 'help') {
      return commands.help([], history, currentDirectory, setCurrentDirectory, setIsLoading, setMatrixRain, setGlitchMode,  setFunMode, setSudoMode, setCurrentTheme);
    }

    if (['portfolio', 'games', 'theme'].includes(command)) {
      setActiveContext(command);
      return commands[command]([], history, currentDirectory, setCurrentDirectory, setIsLoading, setMatrixRain,  setFunMode, setSudoMode, setCurrentTheme);
    }

    if (command.startsWith('project-')) {
      if (projectUrls[command]) {
        const url = projectUrls[command];
        window.open(url, '_blank');
        return `🚀 Opening project link: ${url}`;
      } else {
        return `Project "${command}" not found. Type 'projects' to see a list of available projects.`;
      }
    }

    let availableCommands = Object.keys(commands);
    if (activeContext) {
      availableCommands = activeContext === 'portfolio' ? Object.keys(portfolioCommands) :
                        activeContext === 'games' ? Object.keys(gameCommands) :
                        activeContext === 'theme' ? Object.keys(themeCommands).filter(cmd => cmd.startsWith('theme-')) : availableCommands;
    } else if (funMode) {
      availableCommands = Object.keys(funCommands);
    }

    if (availableCommands.includes(command)) {
      const result = commands[command](args, history, currentDirectory, setCurrentDirectory, setIsLoading, setMatrixRain, setFunMode, setSudoMode, setCurrentTheme);
      if (typeof result === 'function') return result();
      return result || `Command "${command}" executed but returned no output.`;
    }

    if (command.startsWith('ascii-') && funMode) {
      const text = command.replace('ascii-', '');
      return funCommands['ascii-<text>']([text], history, currentDirectory, setCurrentDirectory, setIsLoading, setMatrixRain, setFunMode, setSudoMode, setCurrentTheme) || `ASCII art for "${text}" not found.`;
    }

    return `Command not found: ${cmd}. Type 'help' for available commands.`;
  }, [currentDirectory, funMode, sudoMode, setCurrentDirectory, setIsLoading, setMatrixRain,  setFunMode, setSudoMode, setCurrentTheme, activeContext]);

  const getCommandSuggestion = useCallback((input: string): string | null => {
    let cmds = Object.keys(commands);
    if (activeContext) {
      cmds = activeContext === 'portfolio' ? Object.keys(portfolioCommands) :
            activeContext === 'games' ? Object.keys(gameCommands) :
            activeContext === 'theme' ? Object.keys(themeCommands).filter(cmd => cmd.startsWith('theme-')) : cmds;
    } else if (funMode) {
      cmds = Object.keys(funCommands);
    }
    return cmds.find(cmd => cmd.startsWith(input.toLowerCase())) || null;
  }, [activeContext, funMode]);

  return { executeCommand, getCommandSuggestion, currentTheme, isLoading, matrixRain, handleInterrupt, currentDirectory, gameMode, setGameMode };
};  