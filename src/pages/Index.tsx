import React, { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import Terminal from '@/components/Terminal';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900">
      <Terminal />
    </div>
  );
};

export default Index;