
import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showEnterPrompt, setShowEnterPrompt] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    ip: string;
    userAgent: string;
    platform: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    // Get user information
    const getUserInfo = async () => {
      try {
        // Get IP from an external service
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        setUserInfo({
          ip: ipData.ip || 'Unknown',
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          timestamp: new Date().toLocaleString()
        });
      } catch (error) {
        setUserInfo({
          ip: 'Unknown',
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          timestamp: new Date().toLocaleString()
        });
      }
    };

    getUserInfo();
  }, []);

  const bootLines = [
    'BIOS Version 2.4.1 - Portfolio Terminal',
    'Memory Test: 8192MB OK',
    'Initializing hardware...',
    'Loading kernel modules...',
    'Starting system services...',
    'Mounting file systems...',
    'Network interfaces: UP',
    'Connecting to network...',
    // '',
    // '████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     ',
    // '╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     ',
    // '   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     ',
    // '   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     ',
    // '   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗',
    // '   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝',
    // '',
    'System boot complete.',
    'Welcome to Rahil\'s Portfolio Terminal',
    'Portfolio OS v2.1.0 (Linux Compatible)',
    ''
  ];

  useEffect(() => {
    if (!userInfo) return;

    const timer = setInterval(() => {
      if (currentLine < bootLines.length) {
        setCurrentLine(prev => prev + 1);
      } else {
        setShowEnterPrompt(true);
        clearInterval(timer);
      }
    }, 150);

    return () => clearInterval(timer);
  }, [currentLine, userInfo]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && showEnterPrompt) {
        onComplete();
      }
    };

    if (showEnterPrompt) {
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showEnterPrompt, onComplete]);

  if (!userInfo) {
    return (
      <div className="h-screen bg-black text-green-400 font-mono p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Loading...</div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-green-400 font-mono p-4 overflow-hidden">
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-0">
          <div>Connection Info:</div>
          <div>├── IP Address: {userInfo.ip}</div>
          <div>├── Platform: {userInfo.platform}</div>
          <div>├── User Agent: {userInfo.userAgent.substring(0, 60)}...</div>
          <div>└── Timestamp: {userInfo.timestamp}</div>
        </div>
      </div>

      <div className="space-y-1">
        {bootLines.slice(0, currentLine).map((line, index) => (
          <div key={index} className="flex items-center">
            {line && <span className="text-yellow-400 mr-2">[OK]</span>}
            <span className={line.includes('█') ? 'text-cyan-400' : ''}>{line}</span>
          </div>
        ))}
      </div>

      {showEnterPrompt && (
        <div className="mt-8 text-center">
          <div className="text-xl text-yellow-400 mb-2">
            System Ready
          </div>
          <div className="text-sm text-gray-300 mb-4">
            Username: rahil
          </div>
          <div className="text-sm text-gray-300 mb-4">
            Password: ••••••••
          </div>
          <div className="text-green-400 animate-pulse">
            Press ENTER to continue...
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
