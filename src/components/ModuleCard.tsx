
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  color,
  delay = 0
}) => {
  const colorMap: Record<string, string> = {
    purple: 'from-colorscope-purple to-colorscope-indigo',
    blue: 'from-colorscope-blue to-colorscope-teal',
    pink: 'from-colorscope-pink to-colorscope-purple',
    teal: 'from-colorscope-teal to-colorscope-blue',
  };

  const bgGradient = colorMap[color] || colorMap.purple;

  return (
    <Card 
      className={cn(
        "relative overflow-hidden border-none glass hover:shadow-lg transition-all",
        "animate-fade-in opacity-0"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-10" />
      <div
        className={cn(
          "absolute top-0 left-0 h-1 w-full bg-gradient-to-r",
          bgGradient
        )}
      />
      <div className="p-6">
        <div 
          className={cn(
            "p-3 rounded-md inline-flex bg-gradient-to-r mb-4",
            bgGradient
          )}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button 
          className={cn(
            "bg-gradient-to-r w-full",
            bgGradient
          )}
        >
          Launch Module
        </Button>
      </div>
    </Card>
  );
};

export default ModuleCard;
