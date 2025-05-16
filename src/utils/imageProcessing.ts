
/**
 * Utility functions for image processing across different modules
 */

// Apply median filter effect to an image
export const applyMedianFilter = (imageData: string): string => {
  // In a real app, this would implement actual median filtering algorithm
  // For demo purposes, we're simulating a visible filter effect
  return simulateFilterEffect(imageData, 'median');
};

// Apply bilateral filter effect to an image
export const applyBilateralFilter = (imageData: string): string => {
  // In a real app, this would implement actual bilateral filtering algorithm
  return simulateFilterEffect(imageData, 'bilateral');
};

// Apply gaussian filter effect to an image
export const applyGaussianFilter = (imageData: string): string => {
  // In a real app, this would implement actual gaussian filtering algorithm
  return simulateFilterEffect(imageData, 'gaussian');
};

// Apply DCT compression to an image
export const applyDCTCompression = (imageData: string, level: number): { 
  compressed: string;
  dctVisualization: string;
  originalSize: string;
  compressedSize: string;
  ratio: string;
  psnr: string;
} => {
  // In a real app, this would implement actual DCT compression
  const compressed = simulateFilterEffect(imageData, 'dct');
  const dctVisualization = generateFFTVisualization(imageData);
  
  // Calculate simulated metrics
  const originalSize = '2.4 MB';
  const compressedSize = `${(2.4 * (1 - level / 100)).toFixed(1)} MB`;
  const ratio = `${(100 / (100 - level)).toFixed(1)}:1`;
  const psnr = `${30 + (level / 10).toFixed(1)} dB`;
  
  return {
    compressed,
    dctVisualization,
    originalSize,
    compressedSize,
    ratio,
    psnr
  };
};

// Apply DWT compression to an image
export const applyDWTCompression = (imageData: string, level: number): { 
  compressed: string;
  dwtVisualization: string;
  originalSize: string;
  compressedSize: string;
  ratio: string;
  psnr: string;
} => {
  // In a real app, this would implement actual DWT compression
  const compressed = simulateFilterEffect(imageData, 'dwt');
  const dwtVisualization = generateWaveletVisualization(imageData);
  
  // Calculate simulated metrics
  const originalSize = '2.4 MB';
  const compressedSize = `${(2.4 * (1 - level / 100)).toFixed(1)} MB`;
  const ratio = `${(100 / (100 - level)).toFixed(1)}:1`;
  const psnr = `${32 + (level / 10).toFixed(1)} dB`;
  
  return {
    compressed,
    dwtVisualization,
    originalSize,
    compressedSize,
    ratio,
    psnr
  };
};

// Apply segmentation to an image
export const applySegmentation = (
  imageData: string, 
  segmentCount: number, 
  algorithm: 'watershed' | 'kmeans',
  displayStyle: 'colored' | 'contours'
): {
  segmented: string;
  grayscale: string;
  markers: string;
  largestSegment: string;
  smallestSegment: string;
} => {
  // In a real app, this would implement actual segmentation algorithms
  const segmented = simulateSegmentationEffect(imageData, algorithm, displayStyle);
  const grayscale = simulateGrayscaleConversion(imageData);
  const markers = simulateMarkersVisualization(imageData, segmentCount);
  
  // Calculate simulated segment statistics
  const largestSegment = `${Math.round(45 - segmentCount * 0.5)}% of image`;
  const smallestSegment = `${Math.round(2 + segmentCount * 0.2)}% of image`;
  
  return {
    segmented,
    grayscale,
    markers,
    largestSegment,
    smallestSegment
  };
};

// Generate FFT visualization for frequency domain analysis
export const generateFFTVisualization = (imageData: string): string => {
  // Create a simulated FFT visualization
  return createVisualEffect(imageData, 'fft', 'blue');
};

// Helper function to simulate filter effects on images for demonstration
const simulateFilterEffect = (imageData: string, effectType: string): string => {
  switch(effectType) {
    case 'median':
      return createVisualEffect(imageData, 'blur', 'none');
    case 'bilateral':
      return createVisualEffect(imageData, 'smooth', 'none');
    case 'gaussian':
      return createVisualEffect(imageData, 'blur', 'grey');
    case 'dct':
      return createVisualEffect(imageData, 'compress', 'none');
    case 'dwt':
      return createVisualEffect(imageData, 'wavelet-compress', 'none');
    case 'fft':
      return createVisualEffect(imageData, 'fft', 'blue');
    default:
      return createVisualEffect(imageData, effectType, 'none');
  }
};

// Generate wavelet visualization
const generateWaveletVisualization = (imageData: string): string => {
  // Create a simulated wavelet visualization
  return createVisualEffect(imageData, 'wavelet', 'purple');
};

// Simulate grayscale conversion
const simulateGrayscaleConversion = (imageData: string): string => {
  return createVisualEffect(imageData, 'grayscale', 'none');
};

// Simulate watershed markers visualization
const simulateMarkersVisualization = (imageData: string, segmentCount: number): string => {
  return createVisualEffect(imageData, `markers-${segmentCount}`, 'red');
};

// Simulate segmentation effect
const simulateSegmentationEffect = (
  imageData: string, 
  algorithm: 'watershed' | 'kmeans',
  displayStyle: 'colored' | 'contours'
): string => {
  const style = displayStyle === 'colored' ? 'vibrant' : 'outlined';
  return createVisualEffect(imageData, `segmentation-${algorithm}-${style}`, 'rainbow');
};

// Create a visual effect on the image using a canvas
const createVisualEffect = (imageData: string, effectType: string, colorTint: string): string => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return imageData;
  
  // Create an image element and set its source
  const img = new Image();
  img.crossOrigin = 'Anonymous'; // Handle CORS if needed
  
  // Return a promise that resolves with the modified image data
  return new Promise<string>((resolve) => {
    img.onload = () => {
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Apply visual effect based on the effect type
      switch (effectType) {
        case 'blur':
          // Apply a simple blur effect
          ctx.filter = 'blur(4px)';
          ctx.drawImage(img, 0, 0);
          ctx.filter = 'none';
          break;
          
        case 'smooth':
          // Apply a smoothing effect
          ctx.filter = 'blur(2px) brightness(1.1)';
          ctx.drawImage(img, 0, 0);
          ctx.filter = 'none';
          break;
          
        case 'grayscale':
          // Convert to grayscale
          ctx.filter = 'grayscale(1)';
          ctx.drawImage(img, 0, 0);
          ctx.filter = 'none';
          break;
          
        case 'compress':
          // Simulate compression artifacts
          ctx.filter = 'contrast(1.1) brightness(0.95)';
          ctx.drawImage(img, 0, 0);
          ctx.filter = 'none';
          // Add some blocky artifacts
          const blockSize = 8;
          for (let y = 0; y < canvas.height; y += blockSize) {
            for (let x = 0; x < canvas.width; x += blockSize) {
              const blockData = ctx.getImageData(x, y, 1, 1);
              ctx.fillStyle = `rgba(${blockData.data[0]}, ${blockData.data[1]}, ${blockData.data[2]}, 1)`;
              ctx.fillRect(x, y, blockSize, blockSize);
            }
          }
          break;
          
        case 'wavelet-compress':
          // Simulate wavelet compression
          ctx.filter = 'contrast(1.05) saturate(0.95)';
          ctx.drawImage(img, 0, 0);
          ctx.filter = 'none';
          break;
          
        case 'fft':
          // Create a frequency domain visualization
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw concentric circles with gradient colors
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const maxRadius = Math.min(centerX, centerY);
          
          for (let r = maxRadius; r > 0; r -= 5) {
            const intensity = r / maxRadius;
            ctx.beginPath();
            ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${30 + intensity * 50}, ${100 + intensity * 100}, ${200 + intensity * 55}, ${0.7 - intensity * 0.5})`;
            ctx.fill();
          }
          
          // Add some random "frequency" dots
          for (let i = 0; i < 300; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const intensity = 1 - (distance / maxRadius);
            
            if (intensity > 0) {
              ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.8})`;
              ctx.beginPath();
              ctx.arc(x, y, Math.random() * 2 + 0.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          break;
          
        case 'wavelet':
          // Create a wavelet transform visualization
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw the wavelet quadrants
          const halfWidth = canvas.width / 2;
          const halfHeight = canvas.height / 2;
          
          // Top-left: Low frequency approximation (LL)
          ctx.drawImage(img, 0, 0, halfWidth, halfHeight);
          ctx.filter = 'hue-rotate(60deg) brightness(0.9)';
          
          // Top-right: Horizontal details (LH)
          ctx.drawImage(img, 0, 0, halfWidth, halfHeight, halfWidth, 0, halfWidth, halfHeight);
          
          // Bottom-left: Vertical details (HL)
          ctx.filter = 'hue-rotate(180deg) brightness(0.8)';
          ctx.drawImage(img, 0, 0, halfWidth, halfHeight, 0, halfHeight, halfWidth, halfHeight);
          
          // Bottom-right: Diagonal details (HH)
          ctx.filter = 'hue-rotate(270deg) brightness(0.7)';
          ctx.drawImage(img, 0, 0, halfWidth, halfHeight, halfWidth, halfHeight, halfWidth, halfHeight);
          
          ctx.filter = 'none';
          break;
          
        case 'markers':
          // Draw the original image with overlay markers
          ctx.drawImage(img, 0, 0);
          
          // Add overlay markers
          const numMarkers = parseInt(effectType.split('-')[1]) || 5;
          for (let i = 0; i < numMarkers; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${i * 360 / numMarkers}, 100%, 50%, 0.7)`;
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.font = '12px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(`${i + 1}`, x - 4, y + 4);
          }
          break;
          
        default:
          if (effectType.startsWith('segmentation')) {
            // Parse segmentation parameters
            const parts = effectType.split('-');
            const algorithm = parts[1] || 'watershed';
            const style = parts[2] || 'vibrant';
            
            // Create a segmentation effect
            if (style === 'vibrant') {
              // Create colored segments
              const numSegments = 5;
              const segmentColors = [];
              
              // Generate some distinct colors
              for (let i = 0; i < numSegments; i++) {
                segmentColors.push(`hsl(${i * 360 / numSegments}, 70%, 60%)`);
              }
              
              // Create a canvas pattern of colored segments
              const segmentSize = 50;
              for (let y = 0; y < canvas.height; y += segmentSize) {
                for (let x = 0; x < canvas.width; x += segmentSize) {
                  const colorIndex = Math.floor(Math.random() * segmentColors.length);
                  ctx.fillStyle = segmentColors[colorIndex];
                  
                  // Create irregular polygon shapes for segments
                  ctx.beginPath();
                  ctx.moveTo(x + Math.random() * segmentSize, y);
                  ctx.lineTo(x + segmentSize, y + Math.random() * segmentSize);
                  ctx.lineTo(x + Math.random() * segmentSize, y + segmentSize);
                  ctx.lineTo(x, y + Math.random() * segmentSize);
                  ctx.closePath();
                  ctx.globalAlpha = 0.7;
                  ctx.fill();
                }
              }
              
              // Restore global alpha
              ctx.globalAlpha = 1.0;
              
              // Overlay with the original image for better effect
              ctx.globalCompositeOperation = 'multiply';
              ctx.drawImage(img, 0, 0);
              ctx.globalCompositeOperation = 'source-over';
            } else {
              // Create contour-based segmentation
              // First draw the original image
              ctx.drawImage(img, 0, 0);
              
              // Then draw segment contours
              const numSegments = 15;  // More contours for better visual
              
              ctx.lineWidth = 2;
              ctx.strokeStyle = 'white';
              
              for (let i = 0; i < numSegments; i++) {
                const centerX = Math.random() * canvas.width;
                const centerY = Math.random() * canvas.height;
                const radius = 20 + Math.random() * 60;
                
                ctx.beginPath();
                // Create irregular shapes
                const points = 6 + Math.floor(Math.random() * 6);
                for (let j = 0; j < points; j++) {
                  const angle = (j / points) * Math.PI * 2;
                  const jitter = 0.8 + Math.random() * 0.4;
                  const x = centerX + radius * jitter * Math.cos(angle);
                  const y = centerY + radius * jitter * Math.sin(angle);
                  
                  if (j === 0) {
                    ctx.moveTo(x, y);
                  } else {
                    ctx.lineTo(x, y);
                  }
                }
                ctx.closePath();
                ctx.stroke();
              }
            }
          } else {
            // No special effect, just draw the original image
            ctx.drawImage(img, 0, 0);
          }
      }
      
      // Add color tint if specified
      if (colorTint !== 'none') {
        switch (colorTint) {
          case 'blue':
            ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
          case 'red':
            ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
          case 'green':
            ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
          case 'purple':
            ctx.fillStyle = 'rgba(128, 0, 128, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
          case 'grey':
            ctx.fillStyle = 'rgba(128, 128, 128, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
          case 'rainbow':
            // Create a rainbow gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
            gradient.addColorStop(0.17, 'rgba(255, 165, 0, 0.3)');
            gradient.addColorStop(0.33, 'rgba(255, 255, 0, 0.3)');
            gradient.addColorStop(0.5, 'rgba(0, 128, 0, 0.3)');
            gradient.addColorStop(0.67, 'rgba(0, 0, 255, 0.3)');
            gradient.addColorStop(0.83, 'rgba(75, 0, 130, 0.3)');
            gradient.addColorStop(1, 'rgba(238, 130, 238, 0.3)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
        }
      }
      
      // Convert the canvas to a data URL and resolve
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    
    img.src = imageData;
  }).catch(() => {
    // Fallback in case of errors
    return imageData + `?effect=${effectType}&t=${Date.now()}`;
  }) as unknown as string; // Type assertion to make TypeScript happy
};

// Function to download an image
export const downloadImage = (imageUrl: string, filename: string): void => {
  const a = document.createElement('a');
  a.href = imageUrl;
  a.download = filename || 'download.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
