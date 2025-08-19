
import React, { forwardRef } from 'react';

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  prompt: string;
  theme?: {
    bg: string;
    text: string;
    prompt: string;
  };
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ value, onChange, onKeyDown, prompt, theme = { bg: 'bg-black', text: 'text-green-400', prompt: 'text-yellow-400' } }, ref) => {
    return (
      <div className="flex items-center text-white">
        <span className={`${theme.prompt} mr-1`}>{prompt}</span>        
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="bg-transparent border-none outline-none text-white font-mono flex-1 caret-green-400"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    );
  }
);

TerminalInput.displayName = 'TerminalInput';
