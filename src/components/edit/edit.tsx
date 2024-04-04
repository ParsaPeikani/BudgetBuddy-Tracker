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

export function Edit({
  transaction,
  updateTransaction,
}: {
  transaction: any;
  updateTransaction: (transaction: any) => void;
}) {
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: transaction.transaction || "Unknown",
      amount: transaction.amount.toString(),
      date: new Date(transaction.date),
      category: transaction.category,
      verified: !transaction.verified,
    },
  });

  const [checkedBox, setCheckedBox] = useState(!transaction.verified);

  const onSubmit = (data: any) => {
    console.log("These are the date: ", data);
    console.log(data.date);
    console.log(transaction.date);
    data.amount = Number(data.amount);
    if (
      data.amount === transaction.amount &&
      data.name === transaction.transaction &&
      new Date(data.date).getTime() === new Date(transaction.date).getTime() &&
      data.category === transaction.category &&
      data.verified === !transaction.verified
    ) {
      toast("No changes has been made :)", {
        position: "top-center",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      });
      return;
    }

    data.id = transaction.id;
    updateTransaction(data); // Remove the second argument here
  };
  const onError = (errors: any) => {
    console.error("Form submission errors:", errors);
  };
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
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 w-full">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
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
              <Button variant="outline" type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
