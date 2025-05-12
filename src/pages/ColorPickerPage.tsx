
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Upload, ArrowLeft } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import ColorPicker from '@/components/ColorPicker';
import Histogram from '@/components/Histogram';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const ColorPickerPage = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Mock sample image (in case needed)
  const sampleImage = 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&auto=format&fit=crop';

  // Handle image upload
  const handleImageUploaded = (imageData: string) => {
    setUploadedImage(imageData);
    toast.success("Image uploaded successfully!");
  };

  // Handle image upload button click
  const handleUploadClick = () => {
    document.getElementById('color-picker-upload')?.click();
  };

  // Handle back button
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-colorscope-dark-1 to-colorscope-dark-2">
      <Navbar />
      
      <section className="pt-24 pb-6 px-4">
        <div className="container max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4 flex items-center gap-2 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="md:w-1/3 space-y-6">
              <div className="animate-fade-in bg-white/5 rounded-lg p-6 backdrop-blur-lg border border-white/10">
                <h1 className="text-3xl font-bold mb-2 gradient-text">Color Picker & Histogram</h1>
                <p className="text-gray-300 mb-6">
                  Extract RGB values from any part of your image and analyze the color distribution with detailed histograms.
                </p>
                
                <div className="space-y-4">
                  <ImageUploader 
                    onImageUploaded={handleImageUploaded} 
                    className="animate-fade-in"
                  />
                  
                  {!uploadedImage && (
                    <Button 
                      className="w-full gradient-bg" 
                      onClick={() => setUploadedImage(sampleImage)}
                    >
                      Use Sample Image
                    </Button>
                  )}
                </div>
              </div>
              
              {uploadedImage && (
                <div className="animate-fade-in glass rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Image Details</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-400">Format:</span>
                      <span>JPEG</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Color Mode:</span>
                      <span>RGB</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400">Ready for Analysis</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="md:w-2/3 mt-6 md:mt-0">
              {uploadedImage ? (
                <div className="space-y-6 animate-fade-in">
                  <ColorPicker imageUrl={uploadedImage} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Histogram imageUrl={uploadedImage} type="rgb" />
                    <Histogram imageUrl={uploadedImage} type="grayscale" />
                  </div>
                </div>
              ) : (
                <div className="glass rounded-lg p-8 h-full flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full gradient-animate mb-6 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Image Selected</h3>
                  <p className="text-gray-400 text-center mb-6">
                    Upload an image or use a sample image to start analyzing colors.
                  </p>
                  <div className="flex gap-3">
                    <Button className="gradient-bg" onClick={handleUploadClick}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    <Button variant="outline" onClick={() => setUploadedImage(sampleImage)}>
                      Use Sample Image
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800 mt-auto">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">ColorScope Pro</span>
              <span className="text-gray-600">|</span>
              <span className="text-sm text-gray-400">Color Analysis Module</span>
            </div>
            <p className="text-sm text-gray-400 mt-4 md:mt-0">
              © {new Date().getFullYear()} ColorScope Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ColorPickerPage;
