import { asciiArts } from '../asciiArts';
import { quotes } from '../quotes';
import { fortunes } from '../fortunes';

export const funCommands = {
  'fun-zone': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void) => {
    setFunMode(true);
    setSudoMode(true);
    return ['🎮 ENTERING FUN ZONE 🎮', 'Admin privileges granted!', 'Type "help" to see fun commands', 'Type "exit-fun" to return to normal mode'];
  },
  'exit-fun': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void) => {
    setFunMode(false);
    setSudoMode(false);
    return 'Exited fun zone. Back to serious business! 💼';
  },
  rain: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void) => {
    setMatrixRain(true);
    setTimeout(() => setMatrixRain(false), 5000);
    return 'Initiating matrix rain...';
  },
  hack: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void) => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 5000);
    return ['Hacking in progress...', 'Bypassing firewall...', 'Accessing system files...', 'Hack complete! (Just kidding)'];
  },
  'debugging-simulator': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void) => [
    '🐛 DEBUGGING SIMULATOR 🐛',
    'Error: Cannot read property "undefined" of undefined',
    'Line 42: const bug = undefined.whoops();',
    'How to fix: 1. Add null check, 2. Use optional chaining, 3. Blame the intern',
    'Bug fixed! Ship it! 🚀'
  ],
  'deploy-war': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void) => [
    '⚔️ GIT DEPLOYMENT WAR ⚔️',
    '$ git push origin main',
    'Counting objects: 1337...',
    'Compressing objects: 100%',
    '❌ BUILD FAILED! Error: Missing semicolon',
    'Crisis averted... for now.'
  ],
  'sudo-boot': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void) => [
    'SYSTEM REBOOT INITIATED',
    'BIOS Version 1.33.7',
    'CPU: Intel i9-9999K @ 5.0GHz',
    'Loading OS...',
    'System ready! Welcome back! 🖥️'
  ],
  'sudo-random': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void) => {
    const randomSites = ['https://www.zombo.com', 'https://www.staggeringbeauty.com', 'https://www.pointerpointer.com', 'https://www.bouncingdvdlogo.com', 'https://www.ismycomputeron.com', 'https://www.fallingfalling.com', 'https://www.koalastothemax.com', 'https://www.sanger.dk', 'https://www.patatap.com', 'https://www.thatsthefinger.com', 'https://www.zerowidth.space', 'https://www.thatstheinter.net', 'https://www.rrrgggbbb.com', 'https://www.koalastothemax.com', 'https://www.patience-is-a-virtue.org'];
    const randomSite = randomSites[Math.floor(Math.random() * randomSites.length)];
    setTimeout(() => window.open(randomSite, '_blank'), 1500);
    return ['RANDOM WEBSITE TELEPORTER', 'Scanning the multiverse...', 'Preparing teleportation...', '3... 2... 1... 🚀'];
  },
  dice: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void) => `You rolled a ${Math.floor(Math.random() * 6) + 1}!`,
  ascii: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void) => [
    'ASCII Art Gallery',
    'Available ASCII art:',
    ...Object.keys(asciiArts).map(art => `• ${art}`),
    'Try: ascii-<name> (e.g., ascii-doge)'
  ],
  'ascii-<text>': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: unknown) => {
    const text = args.join(' ').toLowerCase();
    const fullKey = `ascii-${text}`; // Match the full key format
    if (text && asciiArts[fullKey]) {
      return asciiArts[fullKey];
    } else if (text) {
      return [`ASCII art for "${text}" not found.`, 'Available ASCII art:', ...Object.keys(asciiArts).map(art => `• ${art}`)];
    }
    return 'Provide text after ascii- (e.g., ascii-doge)';
  },
  quote: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void) => quotes[Math.floor(Math.random() * quotes.length)],
  fortune: (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void) => fortunes[Math.floor(Math.random() * fortunes.length)],

};