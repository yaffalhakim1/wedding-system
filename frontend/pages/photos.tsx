import { PhotoUpload } from "@/components/photo-upload";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
});

export default function PhotosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Invitation
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className={`${playfair.className} text-4xl md:text-5xl font-light text-rose-600 mb-4`}>
            Photo Gallery
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Share your favorite moments from our special day! Upload photos to create 
            a collaborative gallery that everyone can enjoy.
          </p>
        </div>
        
        <PhotoUpload />
      </div>
    </div>
  );
}