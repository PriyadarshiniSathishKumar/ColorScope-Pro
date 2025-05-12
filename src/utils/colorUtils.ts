
/**
 * Converts an RGB color value to HSL.
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns HSL values as { h: 0-360, s: 0-100, l: 0-100 }
 */
export const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

/**
 * Converts an RGB color to its CMYK representation
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns CMYK values as { c: 0-100, m: 0-100, y: 0-100, k: 0-100 }
 */
export const rgbToCmyk = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const k = 1 - Math.max(r, g, b);
  
  // If k is 1, then c, m, y are all 0
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
};

/**
 * Converts an RGB color to grayscale using luminance formula
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns Grayscale value (0-255)
 */
export const rgbToGrayscale = (r: number, g: number, b: number) => {
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
};

/**
 * Determines if a color is considered "dark" and should use light text
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns Boolean indicating if the color is dark
 */
export const isColorDark = (r: number, g: number, b: number) => {
  // Calculate perceived brightness using YIQ formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

/**
 * Calculates the complementary color of an RGB color
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns Complementary RGB values as { r: 0-255, g: 0-255, b: 0-255 }
 */
export const getComplementaryColor = (r: number, g: number, b: number) => {
  return {
    r: 255 - r,
    g: 255 - g,
    b: 255 - b
  };
};

/**
 * Converts RGB to hex color code
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns Hex color code (e.g. "#FF0000")
 */
export const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (c: number) => {
    const hex = Math.min(255, Math.max(0, Math.round(c))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Converts a hex color code to RGB values
 * @param hex Hex color code (e.g. "#FF0000" or "FF0000")
 * @returns RGB values as { r: 0-255, g: 0-255, b: 0-255 }
 */
export const hexToRgb = (hex: string) => {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex to RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
};

/**
 * Extracts dominant colors from an image
 * (Simplified version - for production use consider a library like color-thief)
 * @param imageUrl URL of the image to analyze
 * @param numColors Number of dominant colors to extract (default: 5)
 * @returns Promise that resolves to an array of hex color codes
 */
export const extractDominantColors = (imageUrl: string, numColors: number = 5): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Resize for efficiency
      const size = 50;
      canvas.width = size;
      canvas.height = size * (img.height / img.width);
      
      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Create color map with frequency
      const colorMap: { [key: string]: number } = {};
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Skip transparent pixels
        if (a < 128) continue;
        
        // Create a simplified color key (reducing precision for better grouping)
        const roundTo = 8;
        const roundedR = Math.round(r / roundTo) * roundTo;
        const roundedG = Math.round(g / roundTo) * roundTo;
        const roundedB = Math.round(b / roundTo) * roundTo;
        
        const colorKey = `${roundedR},${roundedG},${roundedB}`;
        
        if (colorMap[colorKey]) {
          colorMap[colorKey]++;
        } else {
          colorMap[colorKey] = 1;
        }
      }
      
      // Convert to array and sort by frequency
      const colorArray = Object.entries(colorMap)
        .map(([key, count]) => {
          const [r, g, b] = key.split(',').map(Number);
          return {
            hex: rgbToHex(r, g, b),
            count
          };
        })
        .sort((a, b) => b.count - a.count);
      
      // Extract top colors
      const dominantColors = colorArray
        .slice(0, numColors)
        .map(color => color.hex);
      
      resolve(dominantColors);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};
