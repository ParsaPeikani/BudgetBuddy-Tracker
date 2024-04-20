"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const FormSchema = z.object({
  year: z.string({
    required_error: "Please select a year.",
  }),
  month: z.string({
    required_error: "Please select a month.",
  }),
});

export function SelectDate({
  getNewTransactions,
  fetchTransactions,
}: {
  getNewTransactions: (data: any) => void;
  fetchTransactions: () => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onValid(data: z.infer<typeof FormSchema>) {
    if (!data.year) {
      toast("Select the year please ;)", {
        position: "top-center",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      });
      return;
    }
    getNewTransactions(data);
  }

  function onInvalid(errors: any) {
    const formData = form.getValues();
    if (!formData.year && !formData.month) {
      toast("Select both year and month please ;)", {
        position: "top-center",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      });
      return;
    } else if (!formData.year) {
      toast("Select the year please ;)", {
        position: "top-center",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      });
      return;
    }

    if (!formData.month) formData.month = "";
    getNewTransactions(formData);
  }

  function Reset() {
    form.reset({
      year: "",
      month: "",
    });
    fetchTransactions();
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        <Button variant="outline" className="mr-4" onClick={() => Reset()}>
          Reset
        </Button>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onValid, onInvalid)}
            className="flex"
          >
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem className="mr-2">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All Years" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All Months" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="January">January</SelectItem>
                      <SelectItem value="February">February</SelectItem>
                      <SelectItem value="March">March</SelectItem>
                      <SelectItem value="April">April</SelectItem>
                      <SelectItem value="May">May</SelectItem>
                      <SelectItem value="June">June</SelectItem>
                      <SelectItem value="July">July</SelectItem>
                      <SelectItem value="August">August</SelectItem>
                      <SelectItem value="September">September</SelectItem>
                      <SelectItem value="October">October</SelectItem>
                      <SelectItem value="November">November</SelectItem>
                      <SelectItem value="December">December</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button type="submit" variant="outline" className="ml-4">
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <div className="pt-4">
        <Button variant="outline">Get All Transactions</Button>
      </div>
    </div>
  );
}
