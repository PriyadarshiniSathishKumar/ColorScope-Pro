
import React, { useState, useEffect } from 'react';

interface ImageVisualizationProps {
  imageData: string | null;
  altText: string;
  fallbackText: string;
  className?: string;
  isLoading?: boolean;
}

/**
 * A component to display image visualization with proper fallback
 */
const ImageVisualization: React.FC<ImageVisualizationProps> = ({ 
  imageData, 
  altText, 
  fallbackText, 
  className = "w-full h-auto rounded-md border border-gray-700 object-cover",
  isLoading = false
}) => {
  const [hasError, setHasError] = useState(false);
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  
  // Reset error state and update image when imageData changes
  useEffect(() => {
    setHasError(false);
    setRenderedImage(imageData);
  }, [imageData]);
  
  // Check if we have valid image data
  const hasValidData = !hasError && renderedImage && (renderedImage.startsWith('data:') || renderedImage.startsWith('http'));
  
  if (isLoading) {
    return (
      <div className="w-full aspect-video rounded-md border border-gray-700 bg-colorscope-dark-2 flex items-center justify-center animate-pulse">
        <p className="text-gray-400 text-sm">Processing image...</p>
      </div>
    );
  }
  
  return hasValidData ? (
    <img 
      src={renderedImage} 
      alt={altText}
      className={className}
      onError={(e) => {
        console.error(`Failed to load image: ${altText}`);
        setHasError(true);
        // Set a fallback for error
        e.currentTarget.src = 'https://placehold.co/600x400/232323/939393?text=Image+Error';
      }}
    />
  ) : (
    <div className="w-full aspect-video rounded-md border border-gray-700 bg-colorscope-dark-2 flex items-center justify-center">
      <p className="text-gray-400 text-sm">{fallbackText || 'No image available'}</p>
    </div>
  );
};

export default ImageVisualization;
