// API functions for wedding invitation system
// TODO: Replace with actual API endpoints when backend is ready

export interface RsvpFormData {
  name: string;
  email: string;
  phone?: string;
  attendance: "yes" | "no";
  plusOne: boolean;
  plusOneName?: string;
  mealPreference?: "chicken" | "fish" | "vegetarian" | "vegan";
  plusOneMeal?: "chicken" | "fish" | "vegetarian" | "vegan";
  dietaryRestrictions?: string;
  message?: string;
}

export interface PhotoUploadData {
  files: File[];
  uploaderName: string;
  captions: string[];
}

export interface MessageData {
  name: string;
  message: string;
}

export interface WeddingDetails {
  bride: string;
  groom: string;
  date: string;
  time: string;
  venue: {
    name: string;
    address: string;
  };
  ceremony: {
    time: string;
    location: string;
  };
  reception: {
    time: string;
    location: string;
  };
}

// Mock API functions - replace with actual API calls
export const api = {
  // Wedding details
  getWeddingDetails: async (): Promise<WeddingDetails> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return {
      bride: "Sarah",
      groom: "Michael",
      date: "June 15, 2024",
      time: "4:00 PM",
      venue: {
        name: "Rosewood Manor",
        address: "123 Garden Lane, Countryside"
      },
      ceremony: {
        time: "4:00 PM",
        location: "Garden Pavilion"
      },
      reception: {
        time: "6:00 PM",
        location: "Grand Ballroom"
      }
    };
  },

  // RSVP endpoints
  submitRsvp: async (data: RsvpFormData): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    console.log("Submitting RSVP:", data);
    return { success: true, message: "RSVP submitted successfully!" };
  },

  getRsvps: async (): Promise<RsvpFormData[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return []; // Return empty array for now
  },

  // Photo endpoints
  uploadPhotos: async (data: PhotoUploadData): Promise<{ success: boolean; uploadedCount: number }> => {
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate upload delay
    console.log("Uploading photos:", data);
    return { success: true, uploadedCount: data.files.length };
  },

  getPhotos: async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return []; // Return empty array for now
  },

  // Message endpoints
  submitMessage: async (data: MessageData): Promise<{ success: boolean; id: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    console.log("Submitting message:", data);
    return { success: true, id: Math.random().toString(36).substr(2, 9) };
  },

  getMessages: async (): Promise<MessageData[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        name: "Emily Johnson",
        message: "Congratulations to the beautiful couple! Wishing you both a lifetime of love and happiness. Can't wait to celebrate with you! 💕"
      },
      {
        name: "David Smith",
        message: "So excited for your big day! You two are perfect for each other. Here's to many years of joy and adventure together!"
      },
      {
        name: "Sarah & Tom Wilson",
        message: "We've watched your love story unfold and it's been beautiful to witness. Congratulations and we love you both!"
      }
    ];
  },

  // Admin endpoints
  getAdminStats: async (): Promise<{
    totalRsvps: number;
    attending: number;
    notAttending: number;
    plusOnes: number;
    totalMessages: number;
    totalPhotos: number;
  }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      totalRsvps: 25,
      attending: 18,
      notAttending: 7,
      plusOnes: 12,
      totalMessages: 15,
      totalPhotos: 8
    };
  }
};