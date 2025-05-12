
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Logo from '@/components/Logo';
import ModuleCard from '@/components/ModuleCard';
import ImageUploader from '@/components/ImageUploader';
import ColorPicker from '@/components/ColorPicker';
import Histogram from '@/components/Histogram';
import { Button } from '@/components/ui/button';
import { Eye, Layers, Image as ImageIcon, Upload } from 'lucide-react';
import { toast } from "sonner";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Mock sample image
  const sampleImage = 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&auto=format&fit=crop';
  
  const modules = [
    {
      title: 'Color Picker & Histogram',
      description: 'Extract RGB values, view histograms, analyze color distribution',
      icon: <Eye className="h-5 w-5 text-white" />,
      color: 'purple',
    },
    {
      title: 'Noise Remover & Enhancer',
      description: 'Apply non-linear filters, remove noise, preserve details',
      icon: <Layers className="h-5 w-5 text-white" />,
      color: 'blue',
    },
    {
      title: 'Compression & Analysis',
      description: 'Compress using DCT/DWT, compare quality, analyze frequency',
      icon: <ImageIcon className="h-5 w-5 text-white" />,
      color: 'pink',
    },
    {
      title: 'Color-Based Segmentation',
      description: 'Apply watershed segmentation, extract color regions',
      icon: <Layers className="h-5 w-5 text-white" />,
      color: 'teal',
    }
  ];

  // Handle image upload
  const handleImageUploaded = (imageData: string) => {
    setUploadedImage(imageData);
    toast.success("Image uploaded successfully!");
  };

  // Handle module launch
  const handleLaunchModule = (moduleName: string) => {
    toast.info(`${moduleName} module will be available soon!`);
  };

  // Handle demo view
  const handleViewDemo = () => {
    toast.info("Demo mode activated!");
    setUploadedImage(sampleImage);
  };

  // Handle image upload button click
  const handleUploadClick = () => {
    document.getElementById('image-upload')?.click();
  };

  // Handle analysis start
  const handleStartAnalysis = () => {
    toast.success("Analysis started!");
    // In a real app, this would trigger analysis processes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-colorscope-dark-1 to-colorscope-dark-2">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 space-y-6">
              <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                <Logo className="mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                  ColorScope Pro
                </h1>
                <p className="text-lg mb-6 text-gray-200">
                  Advanced Computer Vision Studio for color analysis, 
                  noise reduction, and image compression.
                </p>
                <div className="flex gap-4">
                  <Button className="gradient-bg" onClick={handleUploadClick}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button variant="outline" onClick={handleViewDemo}>View Demo</Button>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 animate-float animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="relative">
                <div className="absolute inset-0 -m-4 rounded-full bg-colorscope-purple/20 blur-2xl animate-pulse-soft"></div>
                <div className="glass rounded-xl overflow-hidden border border-white/10 relative z-10">
                  <img 
                    src={sampleImage} 
                    alt="ColorScope Demo" 
                    className="w-full h-auto rounded-xl hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 glass p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium">Sample Image</h3>
                        <p className="text-xs text-gray-300">RGB Analysis</p>
                      </div>
                      <Button size="sm" className="text-xs gradient-bg" onClick={() => handleStartAnalysis()}>Analyze</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            <span className="gradient-text">Powerful Modules</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <ModuleCard
                key={index}
                title={module.title}
                description={module.description}
                icon={module.icon}
                color={module.color}
                delay={index * 100}
                onLaunch={() => handleLaunchModule(module.title)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Demo Section */}
      <section className="py-12 px-4 bg-colorscope-dark-1/50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            <span className="gradient-text">Try It Out</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <ImageUploader 
                onImageUploaded={handleImageUploaded} 
                className="animate-fade-in"
              />
              
              {uploadedImage && (
                <div className="animate-fade-in glass rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Image Details</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-400">Format:</span>
                      <span>JPEG</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400">Ready for Analysis</span>
                    </p>
                    <Button 
                      className="w-full gradient-bg mt-2"
                      onClick={handleStartAnalysis}
                    >
                      Start Advanced Analysis
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2">
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
                    Upload an image to access the powerful features of ColorScope Pro.
                  </p>
                  <Button className="gradient-bg" onClick={handleUploadClick}>
                    <Upload className="h-4 w-4 mr-2" />
                    Select Image
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo />
            <p className="text-sm text-gray-400 mt-4 md:mt-0">
              © {new Date().getFullYear()} ColorScope Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
