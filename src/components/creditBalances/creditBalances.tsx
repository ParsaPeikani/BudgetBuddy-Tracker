import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useState } from "react";

// Define your form validation schema using Zod
const transactionSchema = z.object({
  name: z.string(),
  amount: z.string(),
  date: z.date(),
  category: z.string(),
  verified: z.boolean(),
});

export function CreditBalances({}) {
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      creditCard: "Unknown",
      debitCard: "Unknown",
    },
  });

  //   const [checkedBox, setCheckedBox] = useState(!transaction.verified);

  const onSubmit = (data: any) => {
    console.log("closing the form ...");
  };
  const onError = (errors: any) => {
    console.error("Form submission errors:", errors);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-4">
          See Balances
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            CIBC Debit && Credit Card Balances
          </DialogTitle>
          <DialogDescription className="text-center">
            These Are Your Current Balances
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div>
              <div className="space-y-4 mb-4">
                <FormField
                  control={form.control}
                  name="creditCard"
                  render={({ field }) => (
                    <FormItem className="flex flex-col md:flex-row items-center md:justify-between space-y-2 md:space-y-0 w-full">
                      <div className="md:flex-1">
                        <FormLabel className="text-base">
                          Credit Card{" "}
                        </FormLabel>
                      </div>
                      <FormControl className="flex-grow">
                        {/* <Input
                          className="ml-8 w-full"
                          placeholder="Enter Transaction Name"
                          {...field}
                        /> */}
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="debitCard"
                render={({ field }) => (
                  <FormItem className="flex flex-col md:flex-row items-center md:justify-between space-y-2 md:space-y-0 w-full">
                    <div className="md:flex-1">
                      <FormLabel className="text-base">Debit Card</FormLabel>
                    </div>
                    <FormControl className="flex-grow">
                      {/* <Input
                        className="ml-8 w-full"
                        placeholder="Enter Transaction Name"
                        {...field}
                      /> */}
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {/* <DialogFooter>
              <Button type="submit" variant="outline">
                Close
              </Button>
            </DialogFooter> */}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
