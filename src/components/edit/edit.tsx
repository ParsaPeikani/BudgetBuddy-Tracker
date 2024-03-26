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
  amount: z.number(),
  date: z.date(),
  category: z.string(),
  verified: z.boolean(),
});

export function Edit({ transaction }: { transaction: any }) {
  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: transaction.transaction || "Unknown",
      amount: transaction.amount,
      date: new Date(transaction.date),
      category: transaction.category,
      verified: !transaction.verified,
    },
  });

  const [checkedBox, setCheckedBox] = useState(!transaction.verified);

  useEffect(() => {
    setValue("date", new Date(transaction.date));
  }, [transaction.date, setValue]);

  const onSubmit = (data: any) => {
    console.log(data);
    // Proceed with your submission logic here...
  };
  const onError = (errors: any) => {
    console.error("Form submission errors:", errors);
  };
  console.log("This is the transaction: ", transaction);
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
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="grid gap-4 py-4"
        >
          <div className="grid gap-4 py-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter Transaction Name"
                    className="col-span-3"
                  />
                </div>
              )}
            />
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))} // Convert string to number here
                    id="amount"
                    placeholder="Enter Transaction Amount"
                    type="number"
                    className="col-span-3"
                  />
                </div>
              )}
            />
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <div className="col-span-3 flex">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex w-full justify-between bg-black text-white hover:bg-primary hover:text-white"
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-2 h-4 w-4 text-white" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Categories
                  </Label>
                  <Input
                    {...field}
                    id="category"
                    placeholder="Enter Transaction Category"
                    className="col-span-3"
                  />
                </div>
              )}
            />
            <Controller
              name="verified"
              control={control}
              render={({ field: { onChange, value, ref } }) => {
                console.log("this is the value", value); // This will log 'true' or 'false'
                return (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="verified" className="text-right">
                      Verified
                    </Label>
                    <div className="col-span-3 flex items-center">
                      <Input
                        id="category"
                        type="checkbox"
                        defaultChecked={value}
                        onChange={(e) => {
                          onChange(e.target.checked);
                        }}
                      />
                    </div>
                  </div>
                );
              }}
            />
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
      </DialogContent>
    </Dialog>
  );
}
