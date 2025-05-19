
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema
const formSchema = z.object({
  paymentMethod: z.enum(["mobile_banking", "credit_card", "qr_code"])
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onConfirm }) => {
  // Setup form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "mobile_banking"
    }
  });

  const handleSubmit = (values: FormValues) => {
    // Map payment method enum to readable text
    const paymentMethodText = {
      mobile_banking: "Mobile Banking",
      credit_card: "Credit Card",
      qr_code: "QR Code"
    }[values.paymentMethod];
    
    onConfirm(paymentMethodText);
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">เลือกวิธีการชำระเงิน</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                        <RadioGroupItem value="mobile_banking" id="mobile_banking" />
                        <Label htmlFor="mobile_banking" className="flex-1 cursor-pointer">
                          Mobile Banking
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                          Credit Card
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                        <RadioGroupItem value="qr_code" id="qr_code" />
                        <Label htmlFor="qr_code" className="flex-1 cursor-pointer">
                          QR Code
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter className="sm:justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-fastlabor-600 hover:bg-fastlabor-700 text-white"
              >
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
