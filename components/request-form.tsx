"use client";

import { useEffect } from "react";

import { useSession } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useForm } from "react-hook-form";

import { SendRequest } from "@/lib/actions";

import { Button } from "./ui/button";
import { DialogClose, DialogFooter } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";

interface Inputs {
  additionalInfo: string;
  type: "bachelor" | "family";
  members: number;
}

interface Props {
  apartmentId: string;
  owner: string;
  modalId: string | null;
  pathname: string;
  router: AppRouterInstance;
}

function RequestForm({ apartmentId, router, pathname, modalId, owner }: Props) {
  const { data: session } = useSession();
  const form = useForm<Inputs>({
    defaultValues: {
      additionalInfo: "",
      type: "bachelor",
      members: 1,
    },
  });

  // Restore form state on return after signin
  useEffect(() => {
    if (session && modalId === apartmentId) {
      const saved = window.sessionStorage.getItem(`Req-${apartmentId}`);
      if (saved) {
        const { type, additionalInfo, members } = JSON.parse(saved);
        form.setValue("type", type);
        form.setValue("additionalInfo", additionalInfo);
        form.setValue("members", members);
        window.sessionStorage.removeItem(`Req-${apartmentId}`);
      }
    }
  }, [session, modalId, apartmentId]);

  // Determine if dialog is open
  async function onSubmit(values: Inputs) {
    const { additionalInfo, members, type } = values;
    if (!session) {
      window.sessionStorage.setItem(
        `Req-${apartmentId}`,
        JSON.stringify({ type, members, additionalInfo })
      );

      router.push(`/signin?callbackUrl=${pathname}?modalId=${apartmentId}`);
      return;
    }

    await SendRequest({
      apartmentId,
      type,
      additionalInfo,
      members,
      requesterId: session?.user.id,
      owner,
    });

    router.push(pathname, { scroll: false });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 border-2 p-4 rounded-md"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="font-bold">Request Type:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  className="flex"
                >
                  <FormItem className="flex">
                    <FormControl>
                      <RadioGroupItem value="bachelor" />
                    </FormControl>
                    <FormLabel className="font-normal">Bachelor</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="family" />
                    </FormControl>
                    <FormLabel className="font-normal">Family</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="members"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="font-bold">
                How Many People Will Stay?{" "}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter the total number of people"
                  type="number"
                  min={1}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  value={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="font-bold">
                Additional Information
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value}
                  placeholder="Provide any relevant details..."
                  className="resize-none whitespace-pre-wrap break-words w-"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Send Request
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default RequestForm;
