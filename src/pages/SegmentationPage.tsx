
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Upload, ArrowLeft, Download, Sliders } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { applySegmentation, downloadImage } from '@/utils/imageProcessing';

const SegmentationPage = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [segmentCount, setSegmentCount] = useState<number>(5);
  const [segmentedImage, setSegmentedImage] = useState<string | null>(null);
  const [grayscaleImage, setGrayscaleImage] = useState<string | null>(null);
  const [markersImage, setMarkersImage] = useState<string | null>(null);
  const [algorithm, setAlgorithm] = useState<'watershed' | 'kmeans'>('watershed');
  const [displayStyle, setDisplayStyle] = useState<'colored' | 'contours'>('colored');
  const [segmentStats, setSegmentStats] = useState<{
    largestSegment: string;
    smallestSegment: string;
  } | null>(null);
  
  // Mock sample image
  const sampleImage = 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&auto=format&fit=crop';

  // Handle image upload
  const handleImageUploaded = (imageData: string) => {
    setUploadedImage(imageData);
    resetSegmentation();
    toast.success("Image uploaded successfully!");
  };

  // Reset segmentation state
  const resetSegmentation = () => {
    setSegmentedImage(null);
    setGrayscaleImage(null);
    setMarkersImage(null);
    setSegmentStats(null);
  };

  // Handle image upload button click
  const handleUploadClick = () => {
    document.getElementById('image-upload')?.click();
  };

  // Handle back button
  const handleBack = () => {
    navigate('/');
  };

  // Handle segment count change
  const handleSegmentCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSegmentCount(Number(e.target.value));
  };

  // Handle algorithm selection
  const handleAlgorithmSelect = (selected: 'watershed' | 'kmeans') => {
    setAlgorithm(selected);
  };

  // Handle display style selection
  const handleDisplayStyleSelect = (selected: 'colored' | 'contours') => {
    setDisplayStyle(selected);
  };

  // Handle segmentation
  const handleSegment = () => {
    if (!uploadedImage) return;
    
    toast.success(`Applying ${algorithm} segmentation with ${segmentCount} segments!`);
    
    const result = applySegmentation(uploadedImage, segmentCount, algorithm, displayStyle);
    
    setSegmentedImage(result.segmented);
    setGrayscaleImage(result.grayscale);
    setMarkersImage(result.markers);
    setSegmentStats({
      largestSegment: result.largestSegment,
      smallestSegment: result.smallestSegment
    });
  };

  // Handle download
  const handleDownload = () => {
    if (!segmentedImage) {
      toast.error("Please apply segmentation first!");
      return;
    }
    
    toast.success("Downloading segmented image...");
    downloadImage(segmentedImage, "segmented_image.jpg");
  };
  
  // Handle color selection
  const handleColorSelection = (color: string) => {
    toast.success(`Selected color: ${color}`);
    // In a real app, this would apply color-based segmentation
  };
  
  // Handle advanced color selection
  const handleAdvancedColorSelection = () => {
    toast.success("Advanced color selection mode activated");
    // In a real app, this would open a color selection UI
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
                <h1 className="text-3xl font-bold mb-2 gradient-text">Color-Based Segmentation</h1>
                <p className="text-gray-300 mb-6">
                  Apply watershed segmentation to separate regions based on color similarity.
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
                    <h3 className="text-lg font-medium mb-4">Segmentation Options</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between">
                          <label className="text-sm">Number of Segments: {segmentCount}</label>
                        </div>
                        <input 
                          type="range" 
                          min="2" 
                          max="15" 
                          value={segmentCount} 
                          onChange={handleSegmentCountChange}
                          className="w-full accent-colorscope-teal mt-2"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm">Algorithm</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="outline" 
                            className={`${algorithm === 'watershed' ? "bg-white/5 border-colorscope-teal" : ""}`}
                            onClick={() => handleAlgorithmSelect('watershed')}
                          >
                            Watershed
                          </Button>
                          <Button 
                            variant="outline"
                            className={`${algorithm === 'kmeans' ? "bg-white/5 border-colorscope-teal" : ""}`}
                            onClick={() => handleAlgorithmSelect('kmeans')}
                          >
                            K-Means
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm">Display Style</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="outline" 
                            className={`${displayStyle === 'colored' ? "bg-white/5 border-colorscope-teal" : ""}`}
                            onClick={() => handleDisplayStyleSelect('colored')}
                          >
                            Colored Regions
                          </Button>
                          <Button 
                            variant="outline"
                            className={`${displayStyle === 'contours' ? "bg-white/5 border-colorscope-teal" : ""}`}
                            onClick={() => handleDisplayStyleSelect('contours')}
                          >
                            Contours
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-colorscope-teal to-colorscope-blue"
                        onClick={handleSegment}
                      >
                        Apply Segmentation
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="glass p-4">
                    <h3 className="text-lg font-medium mb-4">Color Selection</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Optionally select a color range to segment only those regions
                    </p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div 
                        className="h-8 rounded-md bg-red-500 cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                        onClick={() => handleColorSelection("red")}
                      ></div>
                      <div 
                        className="h-8 rounded-md bg-green-500 cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                        onClick={() => handleColorSelection("green")}
                      ></div>
                      <div 
                        className="h-8 rounded-md bg-blue-500 cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                        onClick={() => handleColorSelection("blue")}
                      ></div>
                      <div 
                        className="h-8 rounded-md bg-yellow-500 cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                        onClick={() => handleColorSelection("yellow")}
                      ></div>
                      <div 
                        className="h-8 rounded-md bg-purple-500 cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                        onClick={() => handleColorSelection("purple")}
                      ></div>
                      <div 
                        className="h-8 rounded-md bg-gradient-to-r from-colorscope-teal to-colorscope-blue cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                        onClick={() => handleColorSelection("teal-blue")}
                      ></div>
                    </div>
                    
                    <Button 
                      variant="outline"
                      className="w-full flex items-center gap-2"
                      onClick={handleAdvancedColorSelection}
                    >
                      <Sliders className="h-4 w-4" />
                      Advanced Color Selection
                    </Button>
                  </Card>
                </div>
              )}
            </div>
            
            <div className="md:w-2/3 mt-6 md:mt-0">
              {uploadedImage ? (
                <div className="space-y-6 animate-fade-in">
                  <Card className="glass p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Image Segmentation</h3>
                      <Button 
                        size="sm" 
                        className="gradient-bg flex items-center gap-2" 
                        onClick={handleDownload}
                        disabled={!segmentedImage}
                      >
                        <Download className="h-4 w-4" />
                        Download Result
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
                        <p className="text-sm text-gray-400 mb-2">Segmented Image</p>
                        {segmentedImage ? (
                          <img 
                            src={segmentedImage} 
                            alt="Segmented" 
                            className="w-full h-auto rounded-md border border-gray-700 object-cover" 
                          />
                        ) : (
                          <div className="w-full aspect-video rounded-md border border-gray-700 bg-colorscope-dark-2 flex items-center justify-center">
                            <p className="text-gray-400 text-sm">Apply segmentation to see results</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="glass p-4">
                    <h3 className="text-lg font-medium mb-4">Segmentation Details</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Grayscale Conversion</p>
                          {grayscaleImage ? (
                            <img 
                              src={grayscaleImage} 
                              alt="Grayscale" 
                              className="w-full h-auto rounded-md border border-gray-700 object-cover" 
                            />
                          ) : (
                            <div className="aspect-video rounded-md border border-gray-700 bg-colorscope-dark-2 flex items-center justify-center">
                              <p className="text-gray-400 text-sm">Grayscale view</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Watershed Markers</p>
                          {markersImage ? (
                            <img 
                              src={markersImage} 
                              alt="Markers" 
                              className="w-full h-auto rounded-md border border-gray-700 object-cover" 
                            />
                          ) : (
                            <div className="aspect-video rounded-md border border-gray-700 bg-colorscope-dark-2 flex items-center justify-center">
                              <p className="text-gray-400 text-sm">Markers view</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-md">
                        <h4 className="font-medium mb-2">Segment Statistics</h4>
                        <ul className="text-sm space-y-1">
                          <li className="flex justify-between">
                            <span className="text-gray-400">Number of Segments:</span>
                            <span>{segmentCount}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-400">Largest Segment:</span>
                            <span>{segmentStats?.largestSegment || '42% of image'}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-400">Smallest Segment:</span>
                            <span>{segmentStats?.smallestSegment || '3% of image'}</span>
                          </li>
                        </ul>
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
                    Upload an image or use a sample image to start segmentation.
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
              <span className="text-sm text-gray-400">Segmentation Module</span>
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

export default SegmentationPage;
