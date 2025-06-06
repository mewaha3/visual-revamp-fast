
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Define form schema
const formSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, {
    message: "กรุณาใส่ความคิดเห็น"
  })
});

type FormValues = z.infer<typeof formSchema>;

interface LocationState {
  jobId?: string;
  workerId?: string;
  jobType?: string;
}

const ReviewPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  const [ratingValue, setRatingValue] = useState<number>(3);
  
  // Debug logs
  console.log("Review Page - Job ID from params:", jobId);
  console.log("Review Page - Location state:", state);
  
  // Setup form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 3,
      comment: ""
    }
  });
  
  const onSubmit = (values: FormValues) => {
    // In a real app, we would submit this data to an API
    console.log("Review submitted:", values);
    console.log("For job:", jobId || state?.jobId);
    console.log("For worker:", state?.workerId);
    
    // Show success toast
    toast.success("ขอบคุณสำหรับการให้คะแนน", {
      description: `คุณให้คะแนน ${values.rating} ดาวสำหรับงานนี้`
    });
    
    // Navigate to homepage after short delay
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-lg mx-auto shadow-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Star className="text-yellow-400" size={32} />
              </div>
              <CardTitle className="text-2xl">Review Employee</CardTitle>
              <CardDescription>
                ให้คะแนนและแสดงความคิดเห็น
                {state?.jobType && (
                  <div className="text-sm text-muted-foreground mt-2">
                    ประเภทงาน: {state.jobType}
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-2">
                          <FormLabel>ให้คะแนน</FormLabel>
                          <div className="py-4">
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(vals) => {
                                const value = vals[0];
                                setRatingValue(value);
                                field.onChange(value);
                              }}
                            />
                          </div>
                          <div className="flex justify-between">
                            <span>แย่</span>
                            <span className="font-bold">{ratingValue}/5</span>
                            <span>ดีมาก</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 mt-4">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => {
                                setRatingValue(value);
                                field.onChange(value);
                              }}
                              className="focus:outline-none"
                            >
                              <Star
                                size={32}
                                className={value <= ratingValue ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                              />
                            </button>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ความคิดเห็น</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="แสดงความคิดเห็นของคุณที่นี่..."
                            className="resize-none min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col space-y-3">
                    <Button 
                      type="submit" 
                      className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                    >
                      Submit Review
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/')}
                    >
                      Go to Homepage
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReviewPage;
