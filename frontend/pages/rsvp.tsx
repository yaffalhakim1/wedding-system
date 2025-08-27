import { RsvpForm } from "@/components/rsvp-form";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
});

export default function RsvpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className={`${playfair.className} text-4xl md:text-5xl font-light text-rose-600 mb-4`}>
            RSVP
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We can't wait to celebrate with you! Please let us know if you'll be joining us 
            for our special day by filling out the form below.
          </p>
        </div>
        
        <RsvpForm />
      </div>
    </div>
  );
}