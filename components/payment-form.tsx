"use client";

import { useEffect, useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatePayment, GetUnpaidMonths } from "@/lib/actions";

const formSchema = z.object({
  amount: z.coerce.number().min(1),
  paymentMethod: z.string(),
  transactionId: z.string().min(1),
  month: z.string(),
});

export default function PaymentForm({ apartmentId }: { apartmentId: string }) {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [unpaidMonths, setUnpaidMonths] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      paymentMethod: "",
      transactionId: "",
      month: "",
    },
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadMonths() {
      const months = await GetUnpaidMonths(apartmentId);
      setUnpaidMonths(months);
    }
    loadMonths();
  }, [apartmentId]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      CreatePayment(apartmentId, userId, values).then((res) => {
        if (res.success) {
          toast.success("Payment recorded!");
          form.reset();
        } else {
          toast.error(res.error || "Submission failed");
        }
      });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the amount"
                  type="number"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Enter the payment method " />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bkash">Bkash</SelectItem>
                  <SelectItem value="nagad">Nagad</SelectItem>
                  <SelectItem value="rocket">Rocket</SelectItem>
                  <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the Transaction ID"
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Month</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the month you paid for" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Want to show the unpaid months from the allotted date to the current Month with year */}
                  <SelectContent>
                    {
                      // unpaidMonths.length === 0 ? (
                      //   <SelectItem disabled value="">
                      //     All months paid
                      //   </SelectItem>
                      // ) : (
                      unpaidMonths.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
