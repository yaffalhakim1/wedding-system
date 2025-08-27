import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMessages, useSubmitMessage } from "@/hooks/use-wedding-data";

interface GuestMessage {
  name: string;
  message: string;
}

export function GuestMessages() {
  const { data: messages = [], isLoading, error } = useMessages();
  const submitMessageMutation = useSubmitMessage();
  const [newMessage, setNewMessage] = useState({
    name: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.name.trim() || !newMessage.message.trim()) {
      return;
    }

    try {
      await submitMessageMutation.mutateAsync({
        name: newMessage.name,
        message: newMessage.message
      });
      setNewMessage({ name: "", message: "" });
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      {/* Submit Message Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Leave a Message
          </CardTitle>
          <CardDescription>
            Share your congratulations and well wishes for the happy couple
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="sender-name">Your Name</Label>
              <Input
                id="sender-name"
                placeholder="Enter your name"
                value={newMessage.name}
                onChange={(e) => setNewMessage(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Share your congratulations, memories, or well wishes..."
                value={newMessage.message}
                onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                className="resize-none min-h-[100px]"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={submitMessageMutation.isPending || !newMessage.name.trim() || !newMessage.message.trim()}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {submitMessageMutation.isPending ? "Sending..." : "Send Message"}
            </Button>

            {submitMessageMutation.isError && (
              <div className="text-red-600 text-sm mt-2">
                There was an error sending your message. Please try again.
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Messages Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Messages from Guests ({messages.length})
          </CardTitle>
          <CardDescription>
            Heartfelt messages and congratulations from family and friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300 animate-pulse" />
              <p>Loading messages...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-red-300" />
              <p>Error loading messages.</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No messages yet.</p>
              <p className="text-sm">Be the first to share your congratulations!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={`${message.name}-${index}`} className="flex gap-4 p-4 bg-rose-50/50 rounded-lg">
                  <Avatar>
                    <AvatarFallback className="bg-rose-100 text-rose-600">
                      {getInitials(message.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-800">{message.name}</h4>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}