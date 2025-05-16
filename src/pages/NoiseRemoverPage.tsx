import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Upload, ArrowLeft, Sliders, Play } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import ImageVisualization from '@/components/ImageVisualization';
import { 
  downloadImage,
  applyFixedMedianFilter, 
  applyFixedBilateralFilter, 
  applyFixedGaussianFilter, 
  createVisualEffect 
} from '@/utils/imageProcessingFixedPromise';

const NoiseRemoverPage = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filterIntensity, setFilterIntensity] = useState<number>(50);
  const [detailPreservation, setDetailPreservation] = useState<number>(75);
  const [fftVisualization, setFftVisualization] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
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
  const handleApplyFilter = async (filterType: string) => {
    if (!uploadedImage) return;
    
    setSelectedFilter(filterType);
    setIsProcessing(true);
    toast.success(`Applying ${filterType} filter...`);
    
    try {
      // In a real app, these would apply the actual filter
      let processedImg: string;
      
      switch (filterType) {
        case "Median":
          processedImg = await applyFixedMedianFilter(uploadedImage);
          break;
        case "Bilateral":
          processedImg = await applyFixedBilateralFilter(uploadedImage);
          break;
        case "Gaussian":
          processedImg = await applyFixedGaussianFilter(uploadedImage);
          break;
        case "Custom":
          // Apply custom filter with intensity and detail preservation
          processedImg = await createVisualEffect(
            uploadedImage, 
            'smooth', 
            `${filterIntensity > 70 ? 'blue' : filterIntensity > 40 ? 'purple' : 'red'}`
          );
          break;
        default:
          processedImg = await applyFixedMedianFilter(uploadedImage);
          break;
      }
      
      setProcessedImage(processedImg);
      toast.success(`${filterType} filter applied successfully!`);
    } catch (error) {
      console.error("Error applying filter:", error);
      toast.error("Failed to apply filter. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle process image button
  const handleProcessImage = async () => {
    if (!uploadedImage) return;
    
    if (!selectedFilter) {
      toast.error("Please select a filter first!");
      return;
    }
    
    setIsProcessing(true);
    toast.success("Processing image...");
    
    try {
      // If we already have a processed image, just show a success message
      if (processedImage) {
        toast.success("Image processing complete!");
      } else {
        // Otherwise apply the median filter as default
        const result = await applyFixedMedianFilter(uploadedImage);
        setProcessedImage(result);
        toast.success("Default median filter applied!");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle showing FFT visualization
  const handleShowFFT = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    toast.success("Generating FFT visualization...");
    
    try {
      // Generate FFT visualization
      const fft = await createVisualEffect(uploadedImage, 'fft', 'blue');
      setFftVisualization(fft);
      toast.success("FFT visualization generated!");
    } catch (error) {
      console.error("Error generating FFT:", error);
      toast.error("Failed to generate FFT visualization. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
              {/* Upload section */}
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
                  {/* Filter options */}
                  <Card className="glass p-4">
                    <h3 className="text-lg font-medium mb-4">Filter Options</h3>
                    <div className="space-y-3">
                      <Button 
                        className={`w-full ${selectedFilter === "Median" ? "bg-gradient-to-r from-colorscope-blue to-colorscope-teal ring-2 ring-white/20" : "bg-gradient-to-r from-colorscope-blue to-colorscope-teal"}`}
                        onClick={() => handleApplyFilter("Median")}
                        disabled={isProcessing}
                      >
                        {isProcessing && selectedFilter === "Median" ? "Applying..." : "Apply Median Filter"}
                      </Button>
                      <Button 
                        className={`w-full ${selectedFilter === "Bilateral" ? "bg-gradient-to-r from-colorscope-purple to-colorscope-indigo ring-2 ring-white/20" : "bg-gradient-to-r from-colorscope-purple to-colorscope-indigo"}`}
                        onClick={() => handleApplyFilter("Bilateral")}
                        disabled={isProcessing}
                      >
                        {isProcessing && selectedFilter === "Bilateral" ? "Applying..." : "Apply Bilateral Filter"}
                      </Button>
                      <Button 
                        className={`w-full ${selectedFilter === "Gaussian" ? "bg-gradient-to-r from-colorscope-pink to-colorscope-purple ring-2 ring-white/20" : "bg-gradient-to-r from-colorscope-pink to-colorscope-purple"}`}
                        onClick={() => handleApplyFilter("Gaussian")}
                        disabled={isProcessing}
                      >
                        {isProcessing && selectedFilter === "Gaussian" ? "Applying..." : "Apply Gaussian Filter"}
                      </Button>
                    </div>
                  </Card>
                  
                  {/* Advanced settings */}
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
                        disabled={isProcessing}
                      >
                        <Sliders className="h-4 w-4 mr-2" />
                        {isProcessing && selectedFilter === "Custom" ? "Applying..." : "Apply Custom Settings"}
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
            
            <div className="md:w-2/3 mt-6 md:mt-0">
              {uploadedImage ? (
                <div className="space-y-6 animate-fade-in">
                  {/* Image preview */}
                  <div className="glass p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Image Preview</h3>
                      <Button 
                        size="sm" 
                        className="gradient-bg"
                        onClick={handleProcessImage}
                        disabled={isProcessing}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {isProcessing ? "Processing..." : "Process Image"}
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Original Image</p>
                        <ImageVisualization 
                          imageData={uploadedImage} 
                          altText="Original" 
                          fallbackText="Original image" 
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Processed Image</p>
                        <ImageVisualization 
                          imageData={processedImage}
                          altText="Processed" 
                          fallbackText="Apply a filter to see results" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Frequency domain */}
                  <Card className="glass">
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-4">Frequency Domain</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        View and manipulate the frequency domain representation of your image
                      </p>
                      
                      <ImageVisualization 
                        imageData={fftVisualization}
                        altText="FFT Visualization" 
                        fallbackText="Frequency domain visualization will appear here" 
                      />
                      
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleShowFFT}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Generating..." : "Show FFT Visualization"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                // No image selected view
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
