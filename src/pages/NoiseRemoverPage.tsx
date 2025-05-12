import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Upload, ArrowLeft, Sliders, Play } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { applyMedianFilter, applyBilateralFilter, applyGaussianFilter, generateFFTVisualization } from '@/utils/imageProcessing';

const NoiseRemoverPage = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filterIntensity, setFilterIntensity] = useState<number>(50);
  const [detailPreservation, setDetailPreservation] = useState<number>(75);
  const [fftVisualization, setFftVisualization] = useState<string | null>(null);
  const [showingFFT, setShowingFFT] = useState<boolean>(false);
  
  // Mock sample image
  const sampleImage = 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&auto=format&fit=crop';

  // Handle image upload
  const handleImageUploaded = (imageData: string) => {
    setUploadedImage(imageData);
    setProcessedImage(null); // Reset processed image
    setFftVisualization(null); // Reset FFT visualization
    setSelectedFilter(null); // Reset selected filter
    toast.success("Image uploaded successfully!");
  };

  // Handle image upload button click
  const handleUploadClick = () => {
    document.getElementById('image-upload')?.click();
  };

  // Handle back button
  const handleBack = () => {
    navigate('/');
  };

  // Handle filter intensity change
  const handleFilterIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterIntensity(Number(e.target.value));
  };
  
  // Handle detail preservation change
  const handleDetailPreservationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetailPreservation(Number(e.target.value));
  };

  // Handle filter application
  const handleApplyFilter = (filterType: string) => {
    if (!uploadedImage) return;
    
    setSelectedFilter(filterType);
    toast.success(`${filterType} filter selected!`);
    
    // In a real app, these would apply the actual filter
    switch (filterType) {
      case "Median":
        setProcessedImage(applyMedianFilter(uploadedImage));
        break;
      case "Bilateral":
        setProcessedImage(applyBilateralFilter(uploadedImage));
        break;
      case "Gaussian":
        setProcessedImage(applyGaussianFilter(uploadedImage));
        break;
      case "Custom":
        // Apply custom filter with intensity and detail preservation
        const customized = applyMedianFilter(uploadedImage) + `&intensity=${filterIntensity}&detail=${detailPreservation}`;
        setProcessedImage(customized);
        break;
      default:
        break;
    }
  };
  
  // Handle process image button
  const handleProcessImage = () => {
    if (!uploadedImage) return;
    
    if (!selectedFilter) {
      toast.error("Please select a filter first!");
      return;
    }
    
    toast.success("Processing image...");
    
    // If we already have a processed image, just show a success message
    if (processedImage) {
      toast.success("Image processing complete!");
    } else {
      // Otherwise apply the median filter as default
      setProcessedImage(applyMedianFilter(uploadedImage));
      toast.success("Default median filter applied!");
    }
  };
  
  // Handle showing FFT visualization
  const handleShowFFT = () => {
    if (!uploadedImage) return;
    
    setShowingFFT(true);
    toast.success("Generating FFT visualization...");
    
    // Generate FFT visualization
    const fft = generateFFTVisualization(uploadedImage);
    setFftVisualization(fft);
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
                <h1 className="text-3xl font-bold mb-2 gradient-text">Noise Remover & Enhancer</h1>
                <p className="text-gray-300 mb-6">
                  Apply non-linear filters to remove noise while preserving important image details.
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
                <div className="space-y-4">
                  <Card className="glass p-4">
                    <h3 className="text-lg font-medium mb-4">Filter Options</h3>
                    <div className="space-y-3">
                      <Button 
                        className={`w-full ${selectedFilter === "Median" ? "bg-gradient-to-r from-colorscope-blue to-colorscope-teal ring-2 ring-white/20" : "bg-gradient-to-r from-colorscope-blue to-colorscope-teal"}`}
                        onClick={() => handleApplyFilter("Median")}
                      >
                        Apply Median Filter
                      </Button>
                      <Button 
                        className={`w-full ${selectedFilter === "Bilateral" ? "bg-gradient-to-r from-colorscope-purple to-colorscope-indigo ring-2 ring-white/20" : "bg-gradient-to-r from-colorscope-purple to-colorscope-indigo"}`}
                        onClick={() => handleApplyFilter("Bilateral")}
                      >
                        Apply Bilateral Filter
                      </Button>
                      <Button 
                        className={`w-full ${selectedFilter === "Gaussian" ? "bg-gradient-to-r from-colorscope-pink to-colorscope-purple ring-2 ring-white/20" : "bg-gradient-to-r from-colorscope-pink to-colorscope-purple"}`}
                        onClick={() => handleApplyFilter("Gaussian")}
                      >
                        Apply Gaussian Filter
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="glass p-4">
                    <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className="text-sm">Filter Intensity</label>
                          <span className="text-xs text-gray-400">{filterIntensity}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={filterIntensity} 
                          onChange={handleFilterIntensityChange}
                          className="w-full accent-colorscope-blue"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className="text-sm">Detail Preservation</label>
                          <span className="text-xs text-gray-400">{detailPreservation}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={detailPreservation} 
                          onChange={handleDetailPreservationChange}
                          className="w-full accent-colorscope-purple"
                        />
                      </div>
                      <Button 
                        className={`w-full flex items-center justify-center ${selectedFilter === "Custom" ? "ring-2 ring-white/20" : ""}`}
                        onClick={() => handleApplyFilter("Custom")}
                      >
                        <Sliders className="h-4 w-4 mr-2" />
                        Apply Custom Settings
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
            
            <div className="md:w-2/3 mt-6 md:mt-0">
              {uploadedImage ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="glass p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Image Preview</h3>
                      <Button 
                        size="sm" 
                        className="gradient-bg"
                        onClick={handleProcessImage}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Process Image
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Original Image</p>
                        <img 
                          src={uploadedImage} 
                          alt="Original" 
                          className="w-full h-auto rounded-md border border-gray-700 object-cover" 
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Processed Image</p>
                        {processedImage ? (
                          <img 
                            src={processedImage} 
                            alt="Processed" 
                            className="w-full h-auto rounded-md border border-gray-700 object-cover" 
                          />
                        ) : (
                          <div className="w-full aspect-video rounded-md border border-gray-700 bg-colorscope-dark-2 flex items-center justify-center">
                            <p className="text-gray-400 text-sm">Apply a filter to see results</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Card className="glass">
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-4">Frequency Domain</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        View and manipulate the frequency domain representation of your image
                      </p>
                      
                      {fftVisualization ? (
                        <img 
                          src={fftVisualization} 
                          alt="FFT Visualization" 
                          className="w-full h-auto rounded-md border border-gray-700 object-cover" 
                        />
                      ) : (
                        <div className="h-48 rounded-md bg-colorscope-dark-2 border border-gray-700 flex items-center justify-center">
                          <p className="text-gray-400 text-sm">Frequency domain visualization will appear here</p>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleShowFFT}
                        >
                          Show FFT Visualization
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="glass rounded-lg p-8 h-full flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full gradient-animate mb-6 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Image Selected</h3>
                  <p className="text-gray-400 text-center mb-6">
                    Upload an image or use a sample image to start removing noise.
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
              <span className="text-sm text-gray-400">Noise Remover Module</span>
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

export default NoiseRemoverPage;
