
import React, { useState } from 'react';
import { Upload, File, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageUploaded?: (imageData: string) => void;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setUploadStatus('error');
      setErrorMessage('Please upload an image file');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus('error');
      setErrorMessage('Image size should be less than 10MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setUploadStatus('success');
      if (onImageUploaded) {
        onImageUploaded(result);
      }
    };
    reader.onerror = () => {
      setUploadStatus('error');
      setErrorMessage('Failed to read file');
    };
    reader.readAsDataURL(file);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  return (
    <div 
      className={cn(
        "rounded-lg border border-dashed p-6 text-center",
        isDragging ? "border-colorscope-purple bg-colorscope-purple/5" : "border-gray-300",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />
      
      {uploadStatus === 'idle' && !imagePreview && (
        <div className="animate-fade-in">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-colorscope-purple/20 mb-4">
            <Upload className="h-6 w-6 text-colorscope-purple" />
          </div>
          <h3 className="text-lg font-medium mb-1">Upload your image</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag & drop or click to browse
          </p>
          <Button asChild className="gradient-bg">
            <label htmlFor="image-upload" className="cursor-pointer">
              Select Image
            </label>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Supported formats: JPG, PNG, GIF (Max size: 10MB)
          </p>
        </div>
      )}
      
      {uploadStatus === 'error' && (
        <div className="animate-fade-in">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4">
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-red-500 mb-1">Upload failed</h3>
          <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
          <Button onClick={reset} variant="outline" className="mb-2">
            Try Again
          </Button>
        </div>
      )}
      
      {uploadStatus === 'success' && imagePreview && (
        <div className="animate-fade-in">
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Uploaded preview" 
              className="max-w-full max-h-36 mx-auto rounded-lg mb-4 object-contain" 
            />
            <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-green-500 rounded-full p-1">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-1">Upload successful!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your image is ready for processing
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={reset} variant="outline" size="sm">
              Change Image
            </Button>
            <Button className="gradient-bg" size="sm">
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
