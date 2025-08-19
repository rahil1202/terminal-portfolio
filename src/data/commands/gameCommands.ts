export const gameCommands = {
  games: () => [
    '🎮 AVAILABLE GAMES',
    '=================',
    'game-snake     - Classic snake game',
    'game-2048      - Terminal version of 2048',
    'game-minesweeper - Minesweeper game',
    'game-guess     - Number guessing game',
    'game-tictactoe - Tic Tac Toe',
    'game-memory    - Memory card game',
    'game-hangman   - Hangman game',
    'game-trivia    - Trivia quiz game',
    'game-memorymatch - Memory match game',
    'Type any game command to start playing!'
  ],
  // Change the return value to the game name string
  'game-snake': () => 'snake',
  'game-2048': () => '2048',
  'game-guess': () => 'guess',
  'game-tictactoe': () => 'tictactoe',
  'game-memory': () => 'memory',
  'game-hangman': () => 'hangman',
  'game-trivia': () => 'trivia',
  'game-minesweeper': () => 'minesweeper',
  'game-memorymatch': () => 'memorymatch'
};