
/**
 * Fixed promise handling for image processing functions
 * This will ensure all image visualization operations return valid promises
 */

// Create a visual effect on the image using a canvas with proper promise handling
export const createVisualEffect = (imageData: string, effectType: string, colorTint: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      
      // Create an image element and set its source
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // Handle CORS if needed
      
      // Set up the image onload handler
      img.onload = () => {
        try {
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
          const result = canvas.toDataURL('image/jpeg', 0.9);
          resolve(result);
        } catch (error) {
          console.error("Error in canvas processing:", error);
          reject(error);
        }
      };
      
      // Handle image loading errors
      img.onerror = (error) => {
        console.error("Error loading image:", error);
        reject(new Error("Failed to load image"));
      };
      
      // Set the image source to start loading
      img.src = imageData;
      
    } catch (error) {
      console.error("Error in createVisualEffect:", error);
      reject(error);
    }
  });
};

// Apply segmentation wrapper to use the fixed promise handling
export const applyFixedSegmentation = async (
  imageData: string, 
  segmentCount: number, 
  algorithm: 'watershed' | 'kmeans',
  displayStyle: 'colored' | 'contours'
): Promise<{
  segmented: string;
  grayscale: string;
  markers: string;
  largestSegment: string;
  smallestSegment: string;
}> => {
  try {
    const style = displayStyle === 'colored' ? 'vibrant' : 'outlined';
    const effectType = `segmentation-${algorithm}-${style}`;
    
    const [segmented, grayscale, markers] = await Promise.all([
      createVisualEffect(imageData, effectType, 'rainbow'),
      createVisualEffect(imageData, 'grayscale', 'none'),
      createVisualEffect(imageData, `markers-${segmentCount}`, 'red')
    ]);
    
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
  } catch (error) {
    console.error("Error in applyFixedSegmentation:", error);
    // Return default values on error
    return {
      segmented: imageData,
      grayscale: imageData,
      markers: imageData,
      largestSegment: "Error calculating",
      smallestSegment: "Error calculating"
    };
  }
};

// Apply DCT compression with fixed promise handling
export const applyFixedDCTCompression = async (imageData: string, level: number): Promise<{ 
  compressed: string;
  dctVisualization: string;
  originalSize: string;
  compressedSize: string;
  ratio: string;
  psnr: string;
}> => {
  try {
    const [compressed, dctVisualization] = await Promise.all([
      createVisualEffect(imageData, 'compress', 'none'),
      createVisualEffect(imageData, 'fft', 'blue')
    ]);
    
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
  } catch (error) {
    console.error("Error in applyFixedDCTCompression:", error);
    // Return default values on error
    return {
      compressed: imageData,
      dctVisualization: imageData,
      originalSize: "Error",
      compressedSize: "Error",
      ratio: "Error",
      psnr: "Error"
    };
  }
};

// Apply DWT compression with fixed promise handling
export const applyFixedDWTCompression = async (imageData: string, level: number): Promise<{ 
  compressed: string;
  dwtVisualization: string;
  originalSize: string;
  compressedSize: string;
  ratio: string;
  psnr: string;
}> => {
  try {
    const [compressed, dwtVisualization] = await Promise.all([
      createVisualEffect(imageData, 'wavelet-compress', 'none'),
      createVisualEffect(imageData, 'wavelet', 'purple')
    ]);
    
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
  } catch (error) {
    console.error("Error in applyFixedDWTCompression:", error);
    // Return default values on error
    return {
      compressed: imageData,
      dwtVisualization: imageData,
      originalSize: "Error",
      compressedSize: "Error",
      ratio: "Error",
      psnr: "Error"
    };
  }
};

// Apply filters with fixed promise handling
export const applyFixedMedianFilter = async (imageData: string): Promise<string> => {
  try {
    return await createVisualEffect(imageData, 'blur', 'none');
  } catch (error) {
    console.error("Error in applyFixedMedianFilter:", error);
    return imageData;
  }
};

export const applyFixedBilateralFilter = async (imageData: string): Promise<string> => {
  try {
    return await createVisualEffect(imageData, 'smooth', 'none');
  } catch (error) {
    console.error("Error in applyFixedBilateralFilter:", error);
    return imageData;
  }
};

export const applyFixedGaussianFilter = async (imageData: string): Promise<string> => {
  try {
    return await createVisualEffect(imageData, 'gaussian', 'grey');
  } catch (error) {
    console.error("Error in applyFixedGaussianFilter:", error);
    return imageData;
  }
};

// Function to download an image properly
export const downloadImage = (imageUrl: string, filename: string): void => {
  // Create an anchor element
  const a = document.createElement('a');
  a.href = imageUrl;
  a.download = filename || 'download.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
