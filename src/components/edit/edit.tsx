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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

////////////////////////////
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
  FormDescription,
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
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
/////////////////////////////

// Define your form validation schema using Zod
const transactionSchema = z.object({
  name: z.string(),
  amount: z.string(),
  // date: z.date(),
  category: z.string(),
  verified: z.boolean(),
});

export function Edit({ transaction }: { transaction: any }) {
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: transaction.transaction || "Unknown",
      amount: transaction.amount.toString(),
      // date: new Date(transaction.date),
      category: transaction.category,
      verified: !transaction.verified,
    },
  });

  const [checkedBox, setCheckedBox] = useState(!transaction.verified);

  // useEffect(() => {
  //   setValue("date", new Date(transaction.date));
  // }, [transaction.date, setValue]);

  const onSubmit = (data: any) => {
    console.log("These are the date: ", data);
    // Proceed with your submission logic here...
  };
  const onError = (errors: any) => {
    console.error("Form submission errors:", errors);
  };
  // console.log("This is the transaction: ", transaction);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex bg-black border-none text-white font-normal "
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Edit Transaction</DialogTitle>
          <DialogDescription className="text-center">
            Make changes to your specific transaction here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div>
              <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col md:flex-row items-center md:justify-between space-y-2 md:space-y-0 w-full">
                      <div className="md:flex-1">
                        <FormLabel className="text-base">Name</FormLabel>
                      </div>
                      <FormControl className="flex-grow">
                        <Input
                          className="ml-8 w-full"
                          placeholder="Enter Transaction Name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 w-full">
                      <div className="flex-1">
                        <FormLabel className="text-base">Amount</FormLabel>
                      </div>
                      <FormControl className="md:w-48">
                        <Input
                          className="w-full md:ml-auto"
                          type="number"
                          placeholder="Enter Transaction Amount"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col md:flex-row items-center md:justify-between space-y-2 md:space-y-0 w-full">
                      <div className="md:flex-1">
                        <FormLabel className="text-base">Category</FormLabel>
                      </div>
                      <FormControl className="flex-grow">
                        <Input
                          className="ml-8 w-full"
                          placeholder="Enter Transaction Name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="verified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Verified</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="submit"
                // onClick={() => console.log("Submitting the form")}
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
