
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Pipette, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from "sonner";

interface ColorPickerProps {
  imageUrl: string;
  className?: string;
}

interface PixelInfo {
  x: number;
  y: number;
  rgb: { r: number; g: number; b: number };
  hex: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ imageUrl, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pixelInfo, setPixelInfo] = useState<PixelInfo | null>(null);
  const [copyMessage, setCopyMessage] = useState("");

  const getPixelColor = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    const r = pixelData[0];
    const g = pixelData[1];
    const b = pixelData[2];
    
    // Convert RGB to HEX
    const hex = '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
    
    setPixelInfo({
      x,
      y,
      rgb: { r, g, b },
      hex
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopyMessage(`${type} copied!`);
        toast.success(`${type} copied to clipboard!`);
        setTimeout(() => setCopyMessage(""), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast.error("Failed to copy to clipboard");
      });
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="relative">
        <canvas 
          ref={canvasRef}
          onClick={getPixelColor}
          className="max-w-full h-auto rounded-md cursor-crosshair border"
        />
        <div className="absolute bottom-2 right-2 glass p-2 rounded-md text-xs">
          <div className="flex items-center gap-1">
            <Pipette className="h-3 w-3" />
            <span>Click anywhere to pick a color</span>
          </div>
        </div>
      </div>

      {pixelInfo && (
        <Card className="animate-scale-in glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div 
                className="h-16 w-16 rounded-md border"
                style={{ backgroundColor: pixelInfo.hex }} 
              />
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">HEX</p>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-sm">{pixelInfo.hex}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5" 
                        onClick={() => copyToClipboard(pixelInfo.hex, "HEX")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">RGB</p>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-sm">
                        {`${pixelInfo.rgb.r},${pixelInfo.rgb.g},${pixelInfo.rgb.b}`}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5" 
                        onClick={() => copyToClipboard(`rgb(${pixelInfo.rgb.r}, ${pixelInfo.rgb.g}, ${pixelInfo.rgb.b})`, "RGB")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Position</p>
                    <span className="font-mono text-sm">x:{pixelInfo.x} y:{pixelInfo.y}</span>
                  </div>
                  <div>
                    {copyMessage && (
                      <p className="text-xs text-green-500 animate-fade-in">{copyMessage}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Red</p>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div 
                      className="h-full rounded-full bg-red-500"
                      style={{ width: `${(pixelInfo.rgb.r / 255) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1">{pixelInfo.rgb.r}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Green</p>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div 
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${(pixelInfo.rgb.g / 255) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1">{pixelInfo.rgb.g}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Blue</p>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div 
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${(pixelInfo.rgb.b / 255) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1">{pixelInfo.rgb.b}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ColorPicker;
