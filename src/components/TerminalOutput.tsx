import React, { useState, useEffect } from 'react';

interface TerminalOutputProps {
  content: string | string[] | (string | null)[];
  type: 'input' | 'output' | 'system';
  prompt?: string;
  theme?: {
    bg: string;
    text: string;
    prompt: string;
    accent?: string;
  };
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ 
  content, 
  type, 
  prompt, 
  theme = { bg: 'bg-black', text: 'text-green-400', prompt: 'text-yellow-400' }
}) => {
  const [displayedContent, setDisplayedContent] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (type === 'input') {
      setDisplayedContent([content as string]);
      return;
    }

    if (type === 'system' || !content) {
      setDisplayedContent(Array.isArray(content) ? content.map(item => item?.toString() || '') : [content?.toString() || '']);
      return;
    }

    setIsTyping(true);
    setDisplayedContent([]);

    const lines = Array.isArray(content) ? content : [content];
    let currentLineIndex = 0;
    let currentDisplay: string[] = [];

    const typeLines = () => {
      if (currentLineIndex < lines.length) {
        const line = lines[currentLineIndex];
        if (typeof line === 'string') {
          const words = line.split(' ');
          let currentWordIndex = 0;
          let lineDisplay = '';

          const typeWords = () => {
            if (currentWordIndex < words.length) {
              lineDisplay += (currentWordIndex > 0 ? ' ' : '') + words[currentWordIndex];
              currentDisplay = [...currentDisplay.slice(0, currentLineIndex), lineDisplay];
              setDisplayedContent([...currentDisplay]);
              currentWordIndex++;
              setTimeout(typeWords, 50);
            } else {
              currentLineIndex++;
              if (currentLineIndex < lines.length) {
                setTimeout(typeLines, 100);
              } else {
                setIsTyping(false);
              }
            }
          };

          typeWords();
        } else {
          currentDisplay = [...currentDisplay, typeof line === 'undefined' ? '' : String(line)];
          setDisplayedContent([...currentDisplay]);
          currentLineIndex++;
          if (currentLineIndex < lines.length) {
            setTimeout(typeLines, 100);
          } else {
            setIsTyping(false);
          }
        }
      }
    };

    typeLines();
  }, [content, type]);

  const getLineColor = () => {
    switch (type) {
      case 'input':
        return 'text-white';
      case 'system':
        return 'text-cyan-400';
      case 'output':
      default:
        return theme.text;
    }
  };

  return (
    <div className={`whitespace-pre-wrap ${getLineColor()} leading-relaxed`}>
      {type === 'input' && prompt && (
        <span className={theme.prompt}>{prompt} </span>
      )}
      {displayedContent.map((line, index) => (
        <div key={index}>
          {line}
          {isTyping && index === displayedContent.length - 1 && <span className="animate-pulse">▊</span>}
        </div>
      ))}
    </div>
  );
};