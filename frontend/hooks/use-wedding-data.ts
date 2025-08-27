import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, RsvpFormData, PhotoUploadData, MessageData } from "@/lib/api";

// Query keys
export const queryKeys = {
  weddingDetails: ['wedding-details'],
  rsvps: ['rsvps'],
  messages: ['messages'],
  photos: ['photos'],
  adminStats: ['admin-stats'],
} as const;

// Wedding details
export function useWeddingDetails() {
  return useQuery({
    queryKey: queryKeys.weddingDetails,
    queryFn: api.getWeddingDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// RSVP hooks
export function useSubmitRsvp() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.submitRsvp,
    onSuccess: () => {
      // Invalidate and refetch RSVP data
      queryClient.invalidateQueries({ queryKey: queryKeys.rsvps });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminStats });
    },
  });
}

export function useRsvps() {
  return useQuery({
    queryKey: queryKeys.rsvps,
    queryFn: api.getRsvps,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Photo hooks
export function useUploadPhotos() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.uploadPhotos,
    onSuccess: () => {
      // Invalidate and refetch photo data
      queryClient.invalidateQueries({ queryKey: queryKeys.photos });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminStats });
    },
  });
}

export function usePhotos() {
  return useQuery({
    queryKey: queryKeys.photos,
    queryFn: api.getPhotos,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Message hooks
export function useSubmitMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.submitMessage,
    onSuccess: () => {
      // Invalidate and refetch message data
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminStats });
    },
  });
}

export function useMessages() {
  return useQuery({
    queryKey: queryKeys.messages,
    queryFn: api.getMessages,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Admin hooks
export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.adminStats,
    queryFn: api.getAdminStats,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}