import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitRsvp } from "@/hooks/use-wedding-data";

const rsvpFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  attendance: z.enum(["yes", "no"], {
    required_error: "Please select your attendance",
  }),
  plusOne: z.boolean().default(false),
  plusOneName: z.string().optional(),
  mealPreference: z.enum(["chicken", "fish", "vegetarian", "vegan"], {
    required_error: "Please select a meal preference",
  }).optional(),
  plusOneMeal: z.enum(["chicken", "fish", "vegetarian", "vegan"]).optional(),
  dietaryRestrictions: z.string().optional(),
  message: z.string().optional(),
});

type RsvpFormValues = z.infer<typeof rsvpFormSchema>;

export function RsvpForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submitRsvpMutation = useSubmitRsvp();

  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      attendance: undefined,
      plusOne: false,
      plusOneName: "",
      mealPreference: undefined,
      plusOneMeal: undefined,
      dietaryRestrictions: "",
      message: "",
    },
  });

  const watchAttendance = form.watch("attendance");
  const watchPlusOne = form.watch("plusOne");

  const onSubmit = async (values: RsvpFormValues) => {
    try {
      await submitRsvpMutation.mutateAsync(values);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      // Error handling is managed by React Query
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-600">Thank You!</CardTitle>
          <CardDescription>
            Your RSVP has been received successfully. We're excited to celebrate with you!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">RSVP</CardTitle>
        <CardDescription className="text-center">
          Please let us know if you'll be joining us for our special day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormDescription>Optional, for last-minute updates</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Attendance */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="attendance"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Will you be attending? *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes" />
                          <Label htmlFor="yes">Yes, I'll be there! 🎉</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no" />
                          <Label htmlFor="no">Sorry, can't make it 😔</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Plus One Section - Only show if attending */}
            {watchAttendance === "yes" && (
              <div className="space-y-4 p-4 bg-rose-50 rounded-lg">
                <h3 className="text-lg font-medium">Plus One</h3>
                
                <FormField
                  control={form.control}
                  name="plusOne"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I'll be bringing a plus one</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {watchPlusOne && (
                  <FormField
                    control={form.control}
                    name="plusOneName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plus One Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Name of your plus one" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Meal Preferences - Only show if attending */}
            {watchAttendance === "yes" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Meal Preferences</h3>
                
                <FormField
                  control={form.control}
                  name="mealPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Meal Choice *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your meal preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="chicken">Grilled Chicken</SelectItem>
                          <SelectItem value="fish">Pan-Seared Salmon</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian Pasta</SelectItem>
                          <SelectItem value="vegan">Vegan Garden Bowl</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchPlusOne && (
                  <FormField
                    control={form.control}
                    name="plusOneMeal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plus One Meal Choice</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select meal for your plus one" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="chicken">Grilled Chicken</SelectItem>
                            <SelectItem value="fish">Pan-Seared Salmon</SelectItem>
                            <SelectItem value="vegetarian">Vegetarian Pasta</SelectItem>
                            <SelectItem value="vegan">Vegan Garden Bowl</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="dietaryRestrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Restrictions or Allergies</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please let us know about any dietary restrictions or allergies..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Message */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message for the Couple</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your congratulations or special wishes..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Optional message for the happy couple</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-rose-600 hover:bg-rose-700" 
              disabled={submitRsvpMutation.isPending}
            >
              {submitRsvpMutation.isPending ? "Submitting..." : "Submit RSVP"}
            </Button>

            {submitRsvpMutation.isError && (
              <div className="text-red-600 text-sm mt-2">
                There was an error submitting your RSVP. Please try again.
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}