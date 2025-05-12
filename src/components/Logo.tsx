
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, animated = true }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "relative h-8 w-8 flex items-center justify-center",
        animated && "animate-spin-slow"
      )}>
        <div className="absolute h-full w-full rounded-full bg-colorscope-purple opacity-20"></div>
        <div className="absolute h-6 w-6 rounded-full bg-colorscope-blue opacity-30"></div>
        <div 
          className={cn(
            "absolute h-4 w-4 rounded-full bg-gradient-to-r from-colorscope-pink to-colorscope-teal",
            animated && "animate-pulse-soft"
          )}
        ></div>
        <div className="absolute h-2 w-2 rounded-full bg-white"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight gradient-text">ColorScope</span>
        <span className="text-xs -mt-1 text-colorscope-teal">Pro</span>
      </div>
    </div>
  );
};

export default Logo;
