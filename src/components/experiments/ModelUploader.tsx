
import { useState } from "react";
import { Upload, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { uploadExperimentModel } from "@/services/experimentService";

interface ModelUploaderProps {
  experimentId: string;
  subject: string;
  onModelUploaded?: (modelPath: string) => void;
}

const ModelUploader = ({ experimentId, subject, onModelUploaded }: ModelUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modelType, setModelType] = useState<"gltf" | "obj" | "fbx">("gltf");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Check file type
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (!extension || !["gltf", "glb", "obj", "fbx"].includes(extension)) {
      toast.error("Unsupported file format. Please upload a GLTF, GLB, OBJ, or FBX file.");
      e.target.value = '';
      return;
    }
    
    // Set model type based on extension
    if (extension === "gltf" || extension === "glb") {
      setModelType("gltf");
    } else if (extension === "obj") {
      setModelType("obj");
    } else if (extension === "fbx") {
      setModelType("fbx");
    }
    
    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 10MB.");
      e.target.value = '';
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    
    setIsUploading(true);
    
    // Create a path like "3d models/physics/pendulum.glb"
    const subjectFolder = subject.toLowerCase();
    const fileName = file.name;
    const path = `3d models/${subjectFolder}/${experimentId}/${fileName}`;
    
    try {
      const success = await uploadExperimentModel(file, path, experimentId);
      
      if (success) {
        toast.success("Model uploaded successfully!");
        if (onModelUploaded) {
          onModelUploaded(path);
        }
        setFile(null);
      } else {
        toast.error("Failed to upload model.");
      }
    } catch (error) {
      console.error("Error uploading model:", error);
      toast.error("Failed to upload model. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Upload 3D Model</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a 3D model for this experiment. Supported formats: GLTF, GLB, OBJ, FBX.
              Maximum file size: 10MB.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model-file">Select Model File</Label>
            <Input
              id="model-file"
              type="file"
              accept=".gltf,.glb,.obj,.fbx"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
          
          {file && (
            <div className="bg-muted p-3 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <Check size={16} className="text-green-500" />
                <span className="truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="model-type">Model Type</Label>
            <Select value={modelType} onValueChange={(value: any) => setModelType(value)}>
              <SelectTrigger id="model-type" disabled={isUploading}>
                <SelectValue placeholder="Select model type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gltf">GLTF/GLB</SelectItem>
                <SelectItem value="obj">OBJ</SelectItem>
                <SelectItem value="fbx">FBX</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading} 
            className="w-full"
          >
            {isUploading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Upload Model
              </>
            )}
          </Button>
          
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p><strong>Note:</strong> The model will be stored in a path like:</p>
              <p className="font-mono text-xs mt-1 break-all">3d models/{subject.toLowerCase()}/{experimentId}/{file?.name || "filename.ext"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelUploader;
