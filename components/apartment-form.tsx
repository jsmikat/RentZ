"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CreateApartment, EditApartment } from "@/lib/actions";
import { ApartmentFormSchema } from "@/lib/validations";
import { ApartmentObject } from "@/types/MongodbObjectTypes";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

type ApartmentFormTypes = z.infer<typeof ApartmentFormSchema>;
type Props = {
  apartment?: ApartmentObject;
  type?: "edit" | "create";
};

function ApartmentForm({ apartment, type = "create" }: Props) {
  const form = useForm({
    resolver: zodResolver(ApartmentFormSchema),
    defaultValues: {
      street: apartment?.address.street || "",
      area: apartment?.address.area || "",
      city: apartment?.address.city || "",
      totalRooms: apartment?.totalRooms || 1,
      bathrooms: apartment?.bathrooms || 1,
      bedrooms: apartment?.bedrooms || 1,
      hasParking: apartment?.hasParking || false,
      hasElevator: apartment?.hasElevator || false,
      description: apartment?.description || "",
      rentalPrice: apartment?.rentalPrice || 0,
      size: apartment?.size || 0,
      totalFloors: apartment?.totalFloors || 1,
      floor: apartment?.floor || 1,
    },
  });

  async function onSubmit(values: ApartmentFormTypes) {
    if (type === "edit") {
      const data = await EditApartment(apartment?._id as string, values);
      if (!data.success) {
        toast.error("Error updating apartment");
        return;
      }
      toast.success("Apartment updated successfully!");
      return;
    }
    const data = await CreateApartment(values);
    form.reset();
    if (!data.success) {
      toast.error("Error creating apartment");
      return;
    }
    toast.success("Apartment created successfully!");
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder="A/230 Block" type="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>
                    <FormControl>
                      <Input placeholder="Area name" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="city name" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-6">
            <FormField
              control={form.control}
              name="totalRooms"
              render={({ field }) => (
                <FormItem className="flex items-baseline">
                  <FormLabel>Total rooms</FormLabel>

                  <Select
                    onValueChange={(value) => field.onChange(parseFloat(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a number" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {numberOptions.map((option) => (
                        <SelectItem key={option.value} value={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem className="flex items-baseline">
                  <FormLabel>Bedrooms</FormLabel>

                  <Select
                    onValueChange={(value) => field.onChange(parseFloat(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a number" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {numberOptions.map((option) => (
                        <SelectItem key={option.value} value={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem className="flex items-baseline">
                  <FormLabel>Bathrooms</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseFloat(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a number" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {numberOptions.map((option) => (
                        <SelectItem key={option.value} value={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormControl></FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalFloors"
              render={({ field }) => (
                <FormItem className="flex items-baseline">
                  <FormLabel>Total floors</FormLabel>

                  <Select
                    onValueChange={(value) => field.onChange(parseFloat(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a number" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {numberOptionsFloor.map((option) => (
                        <SelectItem key={option.value} value={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem className="flex items-baseline">
                  <FormLabel>This floor</FormLabel>

                  <Select
                    onValueChange={(value) => field.onChange(parseFloat(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a number" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {numberOptionsFloor.map((option) => (
                        <SelectItem key={option.value} value={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <div className="border-2 p-4">
              <FormField
                control={form.control}
                name="hasElevator"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="mr-2">Has Elevator</FormLabel>
                    <FormControl>
                      <Switch
                        id="has-elevator"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="border-2 p-4">
              <FormField
                control={form.control}
                name="hasParking"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="mr-2">Has Parking</FormLabel>
                    <FormControl>
                      <Switch
                        id="has-parking"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="2400"
                        min={0}
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="rentalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rental Price</FormLabel>
                    <FormControl>
                      <Input
                        min={0}
                        placeholder="$1000"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit">{type === "create" ? "Submit" : "Save"}</Button>
        </form>
      </Form>
    </>
  );
}

export default ApartmentForm;

const numberOptions = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
];
const numberOptionsFloor = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10" },
  { value: 11, label: "11" },
  { value: 12, label: "12" },
  { value: 13, label: "13" },
  { value: 14, label: "14" },
  { value: 15, label: "15" },
  { value: 16, label: "16" },
  { value: 17, label: "17" },
  { value: 18, label: "18" },
  { value: 19, label: "19" },
  { value: 20, label: "20" },
];
