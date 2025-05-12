
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface HistogramProps {
  imageUrl: string;
  type: 'rgb' | 'grayscale';
  className?: string;
}

const Histogram: React.FC<HistogramProps> = ({ imageUrl, type, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const histogramCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageUrl) return;
    
    const loadImage = async () => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;
      
      img.onload = () => {
        const canvas = canvasRef.current;
        const histCanvas = histogramCanvasRef.current;
        if (!canvas || !histCanvas) return;
        
        const ctx = canvas.getContext('2d');
        const histCtx = histCanvas.getContext('2d');
        if (!ctx || !histCtx) return;
        
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        histCanvas.width = 256;
        histCanvas.height = 150;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Initialize histograms
        const histRed = new Array(256).fill(0);
        const histGreen = new Array(256).fill(0);
        const histBlue = new Array(256).fill(0);
        const histGray = new Array(256).fill(0);
        
        // Populate histograms
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          histRed[r]++;
          histGreen[g]++;
          histBlue[b]++;
          
          // Calculate grayscale value using luminance formula
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          histGray[gray]++;
        }
        
        // Find maximum value for scaling
        const maxRed = Math.max(...histRed);
        const maxGreen = Math.max(...histGreen);
        const maxBlue = Math.max(...histBlue);
        const maxGray = Math.max(...histGray);
        
        // Clear histogram canvas
        histCtx.clearRect(0, 0, histCanvas.width, histCanvas.height);
        
        if (type === 'rgb') {
          // Draw RGB histogram
          // Red
          histCtx.beginPath();
          histCtx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
          histCtx.lineWidth = 1;
          
          for (let i = 0; i < 256; i++) {
            const x = i;
            const y = histCanvas.height - (histRed[i] / maxRed) * histCanvas.height;
            if (i === 0) {
              histCtx.moveTo(x, y);
            } else {
              histCtx.lineTo(x, y);
            }
          }
          histCtx.stroke();
          
          // Green
          histCtx.beginPath();
          histCtx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
          
          for (let i = 0; i < 256; i++) {
            const x = i;
            const y = histCanvas.height - (histGreen[i] / maxGreen) * histCanvas.height;
            if (i === 0) {
              histCtx.moveTo(x, y);
            } else {
              histCtx.lineTo(x, y);
            }
          }
          histCtx.stroke();
          
          // Blue
          histCtx.beginPath();
          histCtx.strokeStyle = 'rgba(0, 0, 255, 0.7)';
          
          for (let i = 0; i < 256; i++) {
            const x = i;
            const y = histCanvas.height - (histBlue[i] / maxBlue) * histCanvas.height;
            if (i === 0) {
              histCtx.moveTo(x, y);
            } else {
              histCtx.lineTo(x, y);
            }
          }
          histCtx.stroke();
        } else {
          // Draw grayscale histogram
          histCtx.beginPath();
          histCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          histCtx.fillStyle = 'rgba(200, 200, 200, 0.3)';
          
          histCtx.moveTo(0, histCanvas.height);
          for (let i = 0; i < 256; i++) {
            const x = i;
            const y = histCanvas.height - (histGray[i] / maxGray) * histCanvas.height;
            histCtx.lineTo(x, y);
          }
          histCtx.lineTo(255, histCanvas.height);
          histCtx.closePath();
          histCtx.fill();
          histCtx.stroke();
        }
        
        // Draw axis lines
        histCtx.beginPath();
        histCtx.strokeStyle = 'rgba(150, 150, 150, 0.5)';
        histCtx.moveTo(0, histCanvas.height);
        histCtx.lineTo(255, histCanvas.height);
        histCtx.stroke();
      };
    };
    
    loadImage();
  }, [imageUrl, type]);

  const histogramTitle = type === 'rgb' ? 'RGB Histogram' : 'Grayscale Histogram';
  const histogramColors = type === 'rgb' ? 
    <div className="flex gap-2 text-xs">
      <span className="flex items-center"><span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>Red</span>
      <span className="flex items-center"><span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>Green</span>
      <span className="flex items-center"><span className="h-2 w-2 bg-blue-500 rounded-full mr-1"></span>Blue</span>
    </div> : 
    <span className="text-xs flex items-center"><span className="h-2 w-2 bg-gray-400 rounded-full mr-1"></span>Grayscale</span>;

  return (
    <Card className={cn("overflow-hidden glass", className)}>
      <canvas ref={canvasRef} className="hidden" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">{histogramTitle}</h3>
          {histogramColors}
        </div>
        <div className="bg-colorscope-dark-2 border border-colorscope-dark-3 rounded-md p-2">
          <canvas 
            ref={histogramCanvasRef} 
            className="w-full h-auto"
            style={{ height: '150px' }}
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0</span>
            <span>Pixel Intensity</span>
            <span>255</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Histogram;
