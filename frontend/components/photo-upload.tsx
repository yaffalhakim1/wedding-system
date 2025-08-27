import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Image as ImageIcon, Camera } from "lucide-react";
import Image from "next/image";

interface PhotoWithMetadata {
  id: string;
  file: File;
  preview: string;
  caption: string;
  uploaderName: string;
}

export function PhotoUpload() {
  const [photos, setPhotos] = useState<PhotoWithMetadata[]>([]);
  const [uploaderName, setUploaderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto: PhotoWithMetadata = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: e.target?.result as string,
            caption: "",
            uploaderName,
          };
          setPhotos((prev) => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updatePhotoCaption = (id: string, caption: string) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, caption } : photo
      )
    );
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const handleUpload = async () => {
    if (photos.length === 0) return;

    setIsUploading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      console.log("Uploading photos:", photos);
      
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear photos after successful upload
      setPhotos([]);
      alert("Photos uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Error uploading photos. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Share Your Photos
          </CardTitle>
          <CardDescription>
            Upload photos from the wedding or engagement to share with everyone!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="uploader-name">Your Name</Label>
            <Input
              id="uploader-name"
              placeholder="Enter your name"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
            />
          </div>

          <div>
            <Label>Select Photos</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-rose-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                Click to upload photos
              </p>
              <p className="text-sm text-gray-500">
                Or drag and drop your images here
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supports: JPG, PNG, GIF (max 10MB each)
              </p>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </CardContent>
      </Card>

      {/* Photo Preview Section */}
      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Photos to Upload ({photos.length})</CardTitle>
            <CardDescription>
              Add captions to your photos before uploading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {photos.map((photo) => (
                <div key={photo.id} className="space-y-3">
                  <div className="relative group">
                    <div className="aspect-square relative overflow-hidden rounded-lg border bg-gray-100">
                      <Image
                        src={photo.preview}
                        alt="Photo preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        onClick={() => removePhoto(photo.id)}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`caption-${photo.id}`}>Caption (optional)</Label>
                    <Textarea
                      id={`caption-${photo.id}`}
                      placeholder="Add a caption for this photo..."
                      value={photo.caption}
                      onChange={(e) => updatePhotoCaption(photo.id, e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-6 border-t mt-6">
              <Button
                onClick={handleUpload}
                disabled={isUploading || !uploaderName.trim()}
                className="bg-rose-600 hover:bg-rose-700 px-8"
              >
                {isUploading ? "Uploading..." : `Upload ${photos.length} Photo${photos.length !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Gallery Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Recent Photos
          </CardTitle>
          <CardDescription>
            Photos shared by your fellow guests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No photos uploaded yet.</p>
            <p className="text-sm">Be the first to share your memories!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}