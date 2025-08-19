/* eslint-disable @typescript-eslint/no-explicit-any */
export const systemCommands = {
  whoami: () => 'rahil',
  pwd: (currentDirectory: string) => currentDirectory,
  ls: (fileSystem: any, currentDirectory: string) => {
    const currentFiles = fileSystem[currentDirectory];
    return currentFiles ? Object.keys(currentFiles).map(file => {
      const isDir = currentFiles[file] === 'directory';
      return isDir ? `drwxr-xr-x  2 rahil  staff   64 Dec 25 10:30 ${file}` : `-rw-r--r--  1 rahil  staff  1.2K Dec 25 10:30 ${file}`;
    }) : ['Directory not found'];
  },
  cd: (args: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void) => {
    const targetDir = args[0];
    if (targetDir === '..' || targetDir === 'cd..') {
      if (currentDirectory !== '/home/rahil') {
        const pathParts = currentDirectory.split('/');
        pathParts.pop();
        const newPath = pathParts.join('/') || '/home/rahil';
        setCurrentDirectory(newPath);
        return `Changed directory to ${newPath}`;
      }
      return 'Already in home directory';
    }
    if (targetDir === '~' || targetDir === 'cd~' || !targetDir) {
      setCurrentDirectory('/home/rahil');
      return 'Changed directory to /home/rahil';
    }
    if (targetDir === 'projects') {
      setCurrentDirectory('/home/rahil/projects');
      return 'Changed directory to /home/rahil/projects';
    }
    if (targetDir === 'experience') {
      setCurrentDirectory('/home/rahil/experience');
      return 'Changed directory to /home/rahil/experience';
    }
    return `cd: ${targetDir}: No such file or directory`;
  },
  cat: (args: string[], fileSystem: any, currentDirectory: string) => {
    const filename = args[0];
    const currentFiles = fileSystem[currentDirectory];
    if (currentFiles && currentFiles[filename]) {
      return currentFiles[filename] === 'directory' ? `cat: ${filename}: Is a directory` : currentFiles[filename];
    }
    return `cat: ${filename}: No such file or directory`;
  },
  tree: () => [
    '.',
    '├── README.md',
    '├── contact.txt',
    '├── projects/',
    '│   ├── project1.txt',
    '│   ├── project2.txt',
    '│   └── project3.txt',
    '└── experience/',
    '    ├── current.txt',
    '    └── previous.txt',
    '',
    '3 directories, 6 files'
  ],
  clear: () => '__CLEAR_TERMINAL__',
  exit: () => { window.location.reload(); return 'Exiting...'; },
  uptime: (sessionStartTime: number) => {
    const uptime = Math.floor((Date.now() - sessionStartTime) / 1000);
    const minutes = Math.floor(uptime / 60);
    const seconds = uptime % 60;
    return `Terminal uptime: ${minutes}m ${seconds}s`;
  },
  history: (history: string[]) => (history.length > 0 ? history : ['No command history available']),
  date: () => new Date().toString()
};