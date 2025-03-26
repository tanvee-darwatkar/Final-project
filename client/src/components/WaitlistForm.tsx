import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const waitlistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().optional(),
  consent: z.boolean().refine(val => val === true, {
    message: "You must agree to receive emails.",
  }),
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

const WaitlistForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      consent: false,
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: async (values: WaitlistFormValues) => {
      const res = await apiRequest('POST', '/api/waitlist', values);
      return res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error) => {
      form.setError("root", { 
        type: "manual", 
        message: error.message || 'Something went wrong. Please try again.' 
      });
    }
  });

  function onSubmit(values: WaitlistFormValues) {
    waitlistMutation.mutate(values);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {isSubmitted ? (
          <div className="p-4 bg-green-50 border border-green-100 rounded-md">
            <div className="flex items-start">
              <Check className="text-green-500 mr-2 h-5 w-5" />
              <div>
                <p className="text-green-700 font-medium">You're on the list!</p>
                <p className="text-gray-700 text-sm mt-1">Thanks for joining our waitlist. We'll be in touch with updates soon.</p>
              </div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        I agree to receive emails from KeywordInsight about product updates and promotions. You can unsubscribe at any time.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              {form.formState.errors.root && (
                <div className="text-red-500 text-sm">
                  {form.formState.errors.root.message}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={waitlistMutation.isPending}
              >
                {waitlistMutation.isPending ? "Submitting..." : "Join Waitlist"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default WaitlistForm;
