
export const generateAsciiText = (text: string): string[] => {
  const font = {
    'h': ['██ ██', '█████', '██ ██', '██ ██', '██ ██'],
    'e': ['█████', '██   ', '████ ', '██   ', '█████'],
    'l': ['██   ', '██   ', '██   ', '██   ', '█████'],
    'o': [' ███ ', '██ ██', '██ ██', '██ ██', ' ███ '],
    ' ': ['     ', '     ', '     ', '     ', '     ']
  };
  
  const lines = ['', '', '', '', '', ''];
  for (const char of text.toLowerCase()) {
    if (font[char as keyof typeof font]) {
      font[char as keyof typeof font].forEach((line, i) => {
        lines[i] += line + ' ';
      });
    }
  }
  return lines;
};
