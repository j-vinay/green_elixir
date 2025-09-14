import { useRef, useEffect } from "react";
import { Expand, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThreeDViewerProps {
  modelUrl?: string | null;
  herbName: string;
}

export default function ThreeDViewer({ modelUrl, herbName }: ThreeDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Implement Three.js/React-Three-Fiber 3D model loading
    // This is a placeholder for the 3D model viewer
    if (containerRef.current && modelUrl) {
      // Initialize Three.js scene here
      console.log(`Loading 3D model for ${herbName}: ${modelUrl}`);
    }
  }, [modelUrl, herbName]);

  if (!modelUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-2xl relative overflow-hidden">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <p className="text-muted-foreground">3D Model Not Available</p>
          <p className="text-sm text-muted-foreground mt-2">
            2D visualization for {herbName}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-muted rounded-2xl relative overflow-hidden"
      data-testid="3d-viewer"
    >
      {/* Placeholder for 3D model */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl">🌿</span>
          </div>
          <p className="text-muted-foreground">3D Model Viewer</p>
          <p className="text-sm text-muted-foreground mt-2">
            Rotate • Zoom • Explore
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {herbName}
          </p>
        </div>
      </div>
      
      {/* 3D Model Controls */}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        <Button 
          size="sm" 
          variant="secondary"
          className="w-8 h-8 p-0"
          data-testid="button-fullscreen"
        >
          <Expand className="w-4 h-4" />
        </Button>
        <Button 
          size="sm" 
          variant="secondary"
          className="w-8 h-8 p-0"
          data-testid="button-reset-view"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button 
          size="sm" 
          variant="secondary"
          className="w-8 h-8 p-0"
          data-testid="button-model-info"
        >
          <Info className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
