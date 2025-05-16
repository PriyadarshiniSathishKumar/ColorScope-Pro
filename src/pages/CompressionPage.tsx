
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Upload, ArrowLeft, Download, BarChart } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import ImageVisualization from '@/components/ImageVisualization';
import { downloadImage } from '@/utils/imageProcessing';
import { applyFixedDCTCompression, applyFixedDWTCompression } from '@/utils/imageProcessingFixedPromise';

const CompressionPage = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<number>(50);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [dctVisualization, setDctVisualization] = useState<string | null>(null);
  const [dwtVisualization, setDwtVisualization] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: string;
    compressedSize: string;
    ratio: string;
    psnr: string;
  } | null>(null);
  
  // Mock sample image
  const sampleImage = 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&auto=format&fit=crop';

  // Handle image upload
  const handleImageUploaded = (imageData: string) => {
    setUploadedImage(imageData);
    setCompressedImage(null); // Reset compressed image
    setDctVisualization(null); // Reset DCT visualization
    setDwtVisualization(null); // Reset DWT visualization
    setCompressionStats(null); // Reset compression stats
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

  // Handle compression level change
  const handleCompressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompressionLevel(Number(e.target.value));
  };

  // Handle compression application
  const handleApplyCompression = async (type: string) => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }
    
    setIsProcessing(true);
    toast.success(`Applying ${type} compression at ${compressionLevel}% level...`);
    
    try {
      if (type === "DCT") {
        const result = await applyFixedDCTCompression(uploadedImage, compressionLevel);
        setCompressedImage(result.compressed);
        setDctVisualization(result.dctVisualization);
        setDwtVisualization(null);
        setCompressionStats({
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          ratio: result.ratio,
          psnr: result.psnr
        });
      } else if (type === "DWT") {
        const result = await applyFixedDWTCompression(uploadedImage, compressionLevel);
        setCompressedImage(result.compressed);
        setDwtVisualization(result.dwtVisualization);
        setDctVisualization(null);
        setCompressionStats({
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          ratio: result.ratio,
          psnr: result.psnr
        });
      }
      toast.success(`${type} compression applied successfully!`);
    } catch (error) {
      console.error(`Error applying ${type} compression:`, error);
      toast.error(`Failed to apply ${type} compression. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!compressedImage) {
      toast.error("Please apply compression first!");
      return;
    }
    
    toast.success("Downloading compressed image...");
    downloadImage(compressedImage, "compressed_image.jpg");
  };
  
  // Handle viewing detailed analysis
  const handleViewAnalysis = () => {
    if (!compressedImage) {
      toast.error("Please apply compression first!");
      return;
    }
    
    toast.success("Detailed analysis generated!");
    // In a real app, this would show a modal or navigate to an analysis page
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
                <h1 className="text-3xl font-bold mb-2 gradient-text">Compression & Analysis</h1>
                <p className="text-gray-300 mb-6">
                  Compress images using advanced DCT/DWT transforms with quality control.
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
                    <h3 className="text-lg font-medium mb-4">Compression Options</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm">Compression Level: {compressionLevel}%</label>
                          <span className="text-xs text-gray-400">{100 - compressionLevel}% Quality</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={compressionLevel} 
                          onChange={handleCompressionChange}
                          className="w-full accent-colorscope-purple"
                        />
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-colorscope-purple to-colorscope-indigo"
                        onClick={() => handleApplyCompression("DCT")}
                        disabled={isProcessing || !uploadedImage}
                      >
                        Apply DCT Compression
                      </Button>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-colorscope-pink to-colorscope-purple"
                        onClick={() => handleApplyCompression("DWT")}
                        disabled={isProcessing || !uploadedImage}
                      >
                        Apply DWT Compression
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="glass p-4">
                    <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white/5 rounded-md">
                          <p className="text-xs text-gray-400">Original Size</p>
                          <p className="font-medium">{compressionStats?.originalSize || "N/A"}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-md">
                          <p className="text-xs text-gray-400">Compressed Size</p>
                          <p className="font-medium">{compressionStats?.compressedSize || "N/A"}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-md">
                          <p className="text-xs text-gray-400">Compression Ratio</p>
                          <p className="font-medium">{compressionStats?.ratio || "N/A"}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-md">
                          <p className="text-xs text-gray-400">PSNR</p>
                          <p className="font-medium">{compressionStats?.psnr || "N/A"}</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full flex items-center justify-center"
                        variant="outline"
                        onClick={handleViewAnalysis}
                        disabled={!compressedImage}
                      >
                        <BarChart className="h-4 w-4 mr-2" />
                        View Detailed Analysis
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
            
            <div className="md:w-2/3 mt-6 md:mt-0">
              {uploadedImage ? (
                <div className="space-y-6 animate-fade-in">
                  <Card className="glass p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Image Comparison</h3>
                      <Button 
                        size="sm" 
                        className="gradient-bg flex items-center gap-2" 
                        onClick={handleDownload}
                        disabled={!compressedImage}
                      >
                        <Download className="h-4 w-4" />
                        Download Compressed
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Original Image</p>
                        <ImageVisualization 
                          imageData={uploadedImage} 
                          altText="Original Image" 
                          fallbackText="Upload an image to see the original"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Compressed Image</p>
                        <ImageVisualization 
                          imageData={compressedImage} 
                          altText="Compressed Image" 
                          fallbackText="Apply compression to see results"
                          isLoading={isProcessing}
                        />
                      </div>
                    </div>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="glass p-4">
                      <h3 className="text-lg font-medium mb-4">Frequency Domain (DCT)</h3>
                      <ImageVisualization 
                        imageData={dctVisualization} 
                        altText="DCT Visualization" 
                        fallbackText="DCT visualization will appear here"
                        isLoading={isProcessing && !dwtVisualization}
                      />
                    </Card>
                    
                    <Card className="glass p-4">
                      <h3 className="text-lg font-medium mb-4">Wavelet Domain (DWT)</h3>
                      <ImageVisualization 
                        imageData={dwtVisualization} 
                        altText="DWT Visualization" 
                        fallbackText="DWT visualization will appear here"
                        isLoading={isProcessing && !dctVisualization}
                      />
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="glass rounded-lg p-8 h-full flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full gradient-animate mb-6 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Image Selected</h3>
                  <p className="text-gray-400 text-center mb-6">
                    Upload an image or use a sample image to start compressing.
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
              <span className="text-sm text-gray-400">Compression Module</span>
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

export default CompressionPage;
