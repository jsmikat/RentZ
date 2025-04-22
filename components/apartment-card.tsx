"use client";

import { useState } from "react";

import { SendRequest } from "@/lib/actions";
import { ApartmentObject } from "@/types/MongodbObjectTypes";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Textarea } from "./ui/textarea";

interface Props {
  apartments: ApartmentObject[];
}

export default function ApartmentTableWithDialog({ apartments }: Props) {
  return (
    <Table className="w-full max-w-4xl mx-auto mb-6 font-normal text-base">
      <TableHeader className="text-lg font-semibold">
        <TableRow>
          <TableHead>Location</TableHead>
          <TableHead>Details</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Size (sqft)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apartments.map((apt) => (
          <ApartmentRequestRow key={apt._id} apt={apt} />
        ))}
      </TableBody>
    </Table>
  );
}

function ApartmentRequestRow({ apt }: { apt: ApartmentObject }) {
  const [tenancyType, setTenancyType] = useState<"bachelor" | "family">(
    "bachelor"
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog>
      <DialogTrigger onClick={} asChild className="cursor-pointer">
        <TableRow>
          <TableCell>
            {apt.address.street}, {apt.address.city}
          </TableCell>
          <TableCell className="text-sm text-muted-foreground">
            {apt.description.length > 40
              ? apt.description.slice(0, 40) + "..."
              : apt.description}
          </TableCell>
          <TableCell className="text-right">
            ৳{apt.rentalPrice.toLocaleString()}
          </TableCell>
          <TableCell className="text-right">{apt.size}</TableCell>
        </TableRow>
      </DialogTrigger>
      <DialogContent className="w-[90vw] sm:w-[420px] md:w-full rounded-lg">
        <DialogHeader>
          <DialogTitle>Apartment Details</DialogTitle>
          <DialogDescription>
            Complete information for your request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <p>
            <strong>Name:</strong> {apt.name}
          </p>
          <p>
            <strong>Address:</strong> {apt.address.street}, {apt.address.city},{" "}
            {apt.address.district}, {apt.address.division}
          </p>
          <p>
            <strong>Description:</strong> {apt.description}
          </p>
          <p>
            <strong>Price:</strong> ৳{apt.rentalPrice.toLocaleString()}
          </p>
          <p>
            <strong>Size:</strong> {apt.size} sqft
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            await SendRequest({
              apartmentId: apt._id,
              tenancyType,
              message,
            });
            setIsSubmitting(false);
          }}
          className="space-y-4 pt-4"
        >
          <div className="space-y-1">
            <Label className="mb-2" id={`tenancy-type-${apt._id}`}>
              Tenancy Type
            </Label>
            <RadioGroup
              aria-labelledby={`tenancy-type-${apt._id}`}
              name="tenancyType"
              value={tenancyType}
              onValueChange={(val) =>
                setTenancyType(val as "bachelor" | "family")
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bachelor" id={`bachelor-${apt._id}`} />
                <Label htmlFor={`bachelor-${apt._id}`}>Bachelor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="family" id={`family-${apt._id}`} />
                <Label htmlFor={`family-${apt._id}`}>Family</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1">
            <Label className="mb-2" htmlFor={`message-${apt._id}`}>
              Message
            </Label>
            <Textarea
              id={`message-${apt._id}`}
              name="message"
              placeholder="Add a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="mr-2">
              Send Request
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
