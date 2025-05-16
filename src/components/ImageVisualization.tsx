
import React from 'react';

interface ImageVisualizationProps {
  imageData: string | null;
  altText: string;
  fallbackText: string;
  className?: string;
}

/**
 * A component to display image visualization with proper fallback
 */
const ImageVisualization: React.FC<ImageVisualizationProps> = ({ 
  imageData, 
  altText, 
  fallbackText, 
  className = "w-full h-auto rounded-md border border-gray-700 object-cover" 
}) => {
  // Check if we have valid image data
  const hasValidData = imageData && imageData.startsWith('data:') || imageData?.startsWith('http');
  
  return hasValidData ? (
    <img 
      src={imageData} 
      alt={altText}
      className={className}
      onError={(e) => {
        console.error(`Failed to load image: ${altText}`);
        // Set a fallback for error
        e.currentTarget.src = 'https://placehold.co/600x400/232323/939393?text=Image+Error';
      }}
    />
  ) : (
    <div className="w-full aspect-video rounded-md border border-gray-700 bg-colorscope-dark-2 flex items-center justify-center">
      <p className="text-gray-400 text-sm">{fallbackText}</p>
    </div>
  );
};

export default ImageVisualization;
