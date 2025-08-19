/* eslint-disable @typescript-eslint/no-explicit-any */
import { themes } from '../themes';

export const themeCommands = {

  'theme-solarized': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.solarized);
    return 'Switched to solarized theme!';
  },
  'theme-dracula': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.dracula);
    return 'Switched to dracula theme!';
  },
  'theme-hacker': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.hacker || themes.matrix); // Fallback if not defined
    return 'Switched to hacker theme!';
  },
    'theme-matrix': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.matrix);
    return 'Switched to matrix theme!';
  },
  'theme-cyberpunk': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.cyberpunk || themes.matrix);
    return 'Switched to cyberpunk theme!';
  },
  'theme-monokai': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.monokai || themes.matrix);
    return 'Switched to monokai theme!';
  },
  'theme-nord': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.nord || themes.matrix);
    return 'Switched to nord theme!';
  },
  'theme-terminal-classic': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes["terminal-classic"] || themes.matrix);
    return 'Switched to terminal classic theme!';
  },
  'theme-whiteout': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.whiteout || themes.matrix);
    return 'Switched to whiteout theme!';
  },
  'theme-abyss': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.abyss || themes.matrix);
    return 'Switched to abyss theme!';
  },
  'theme-ocean': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.ocean || themes.matrix);
    return 'Switched to ocean theme!';
  },
  'theme-forest': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.forest || themes.matrix);
    return 'Switched to forest theme!';
  },
  'theme-sunset': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.sunset || themes.matrix);
    return 'Switched to sunset theme!';
  },
  'theme-neon': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.neon || themes.matrix);
    return 'Switched to neon theme!';
  },
  'theme-pastel': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.pastel || themes.matrix);
    return 'Switched to pastel theme!';
  },
  'theme-midnight': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.midnight || themes.matrix);
    return 'Switched to midnight theme!';
  },
  'theme-retro': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.retro || themes.matrix);
    return 'Switched to retro theme!';
  },
  'theme-arctic': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.arctic || themes.matrix);
    return 'Switched to arctic theme!';
  },
  'theme-lava': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.lava || themes.matrix);
    return 'Switched to lava theme!';
  },
  'theme-twilight': (args: string[], history: string[], currentDirectory: string, setCurrentDirectory: (dir: string) => void, setIsLoading: (loading: boolean) => void, setMatrixRain: (rain: boolean) => void, setFunMode: (mode: boolean) => void, setSudoMode: (mode: boolean) => void, setCurrentTheme: (theme: any) => void) => {
    setCurrentTheme(themes.twilight || themes.matrix);
    return 'Switched to twilight theme!';
  }
};