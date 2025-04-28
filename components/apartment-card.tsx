"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { BedSingle, DoorOpen, Toilet } from "lucide-react";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";

import { SendRequest } from "@/lib/actions";
import { ApartmentObject } from "@/types/MongodbObjectTypes";

import Badge from "./ui/badge";
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
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

interface Props {
  apartments: ApartmentObject[];
}

export function ApartmentCard({ apartment }: { apartment: ApartmentObject }) {
  return (
    <motion.div
      initial={{ transform: "translateY(40px)", opacity: 0 }}
      animate={{
        transform: "translateY(0)",
        opacity: 1,
        transition: { duration: 0.3 },
      }}
      className="flex flex-col text-left items-start gap-3 p-4 border rounded-lg border-primary shadow-sm"
    >
      <div className="flex items-center gap-2">
        <svg
          width={16 * 1.5}
          height={17 * 1.5}
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.3 12.3215C11.9526 12.5546 12.3971 12.8515 12.5772 13.1748C12.7572 13.4981 12.6648 13.8332 12.3116 14.1378C11.9584 14.4423 11.3603 14.7026 10.5928 14.8858C9.8254 15.0689 8.92314 15.1666 8.00016 15.1666C7.07718 15.1666 6.17493 15.0689 5.4075 14.8858C4.64007 14.7026 4.04194 14.4423 3.68873 14.1378C3.33552 13.8332 3.2431 13.4981 3.42317 13.1748C3.60323 12.8515 4.04769 12.5546 4.70033 12.3215M12.6668 6.36665C12.6668 8.87034 8.00017 13.1666 8.00017 13.1666C8.00017 13.1666 3.3335 8.87034 3.3335 6.36665C3.3335 3.86296 5.42284 1.83331 8.00017 1.83331C10.5775 1.83331 12.6668 3.86296 12.6668 6.36665ZM9.75016 6.36665C9.75016 7.30553 8.96666 8.06665 8.00017 8.06665C7.03367 8.06665 6.25017 7.30553 6.25017 6.36665C6.25017 5.42776 7.03367 4.66665 8.00017 4.66665C8.96666 4.66665 9.75016 5.42776 9.75016 6.36665Z"
            stroke="#282930"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-base text-gray-600">{`${apartment.address.street}, ${apartment.address.area}, ${apartment.address.city}`}</p>
      </div>
      <h2 className="text-lg font-medium my-2">
        {apartment.description.length > 120
          ? apartment.description.slice(0, 140) + "..."
          : apartment.description}
      </h2>
      <div className="flex gap-4 flex-wrap items-center">
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg border border-primary">
          <DoorOpen strokeWidth={1.5} className="size-6" />
          <p className="text-sm text-gray-800">{`Total rooms: ${
            apartment.totalRooms
          }`}</p>
        </div>
        <div className="flex items-center px-2 gap-1 py-1 bg-gray-100 rounded-lg border border-primary">
          <BedSingle strokeWidth={1.5} className="size-6" />
          <p className="text-sm text-gray-800">{`Bedrooms: ${
            apartment.bedrooms
          }`}</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg border border-primary">
          <Toilet strokeWidth={1.5} className="size-6" />
          <p className="text-sm text-gray-800">{`Bathrooms: ${
            apartment.bathrooms
          }`}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 flex-col sm:flex-row">
        <div className="flex items-center gap-2">
          <p className="text-base font-bold">Elevetor: </p>
          {apartment.hasElevator ? (
            <Badge type="available" />
          ) : (
            <Badge type="not-available" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold">Parking: </p>
          {apartment.hasParking ? (
            <Badge type="available" />
          ) : (
            <Badge type="not-available" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <strong className="font-bold">Rental Price:</strong>{" "}
        <p className="italic">
          {" "}
          ৳{apartment.rentalPrice.toLocaleString()}/month
        </p>
      </div>
    </motion.div>
  );
}

export default function ApartmentCardExpandable({
  apartment,
}: {
  apartment: ApartmentObject;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modalId = searchParams.get("modalId");

  const [tenancyType, setTenancyType] = useState<"bachelor" | "family">(
    "bachelor"
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore form state on return after signin
  useEffect(() => {
    if (session && modalId === apartment._id && typeof window !== "undefined") {
      const saved = window.sessionStorage.getItem(`Req-${apartment._id}`);
      if (saved) {
        const { tenancyType, message } = JSON.parse(saved);
        setTenancyType(tenancyType);
        setMessage(message);
        window.sessionStorage.removeItem(`Req-${apartment._id}`);
      }
    }
  }, [session, modalId, apartment._id]);

  // Determine if dialog is open
  const open = modalId === apartment._id;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          router.push(`${pathname}?modalId=${apartment._id}`, {
            scroll: false,
          });
        } else {
          router.push(pathname, { scroll: false });
        }
      }}
    >
      <DialogTrigger className="cursor-pointer">
        <ApartmentCard apartment={apartment} />
      </DialogTrigger>
      <DialogContent className="w-[90vw] sm:w-[420px] md:w-full overflow-y-auto max-h-screen rounded-lg">
        <DialogHeader>
          <DialogTitle>Apartment Details</DialogTitle>
          <DialogDescription>
            Complete information for your request.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <svg
              width={16 * 1.5}
              height={17 * 1.5}
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.3 12.3215C11.9526 12.5546 12.3971 12.8515 12.5772 13.1748C12.7572 13.4981 12.6648 13.8332 12.3116 14.1378C11.9584 14.4423 11.3603 14.7026 10.5928 14.8858C9.8254 15.0689 8.92314 15.1666 8.00016 15.1666C7.07718 15.1666 6.17493 15.0689 5.4075 14.8858C4.64007 14.7026 4.04194 14.4423 3.68873 14.1378C3.33552 13.8332 3.2431 13.4981 3.42317 13.1748C3.60323 12.8515 4.04769 12.5546 4.70033 12.3215M12.6668 6.36665C12.6668 8.87034 8.00017 13.1666 8.00017 13.1666C8.00017 13.1666 3.3335 8.87034 3.3335 6.36665C3.3335 3.86296 5.42284 1.83331 8.00017 1.83331C10.5775 1.83331 12.6668 3.86296 12.6668 6.36665ZM9.75016 6.36665C9.75016 7.30553 8.96666 8.06665 8.00017 8.06665C7.03367 8.06665 6.25017 7.30553 6.25017 6.36665C6.25017 5.42776 7.03367 4.66665 8.00017 4.66665C8.96666 4.66665 9.75016 5.42776 9.75016 6.36665Z"
                stroke="#282930"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-base text-gray-600">{`${apartment.address.street}, ${apartment.address.area}, ${apartment.address.city}`}</p>
          </div>
          <p className="text-base my-2">{apartment.description}</p>
          <div className="flex gap-4 flex-wrap items-center">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg border border-primary">
              <DoorOpen strokeWidth={1.5} className="size-6" />
              <p className="text-sm text-gray-800">{`Total rooms: ${
                apartment.totalRooms
              }`}</p>
            </div>
            <div className="flex items-center px-2 gap-1 py-1 bg-gray-100 rounded-lg border border-primary">
              <BedSingle strokeWidth={1.5} className="size-6" />
              <p className="text-sm text-gray-800">{`Bedrooms: ${
                apartment.bedrooms
              }`}</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg border border-primary">
              <Toilet strokeWidth={1.5} className="size-6" />
              <p className="text-sm text-gray-800">{`Bathrooms: ${
                apartment.bathrooms
              }`}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <p className="font-bold">Building Floors:</p>
            <p className="text-base">{`${apartment.totalFloors}`}</p>
          </div>

          <div className="flex gap-2">
            <p className="font-bold">Apartment Floor:</p>
            <p className="text-base">{`${apartment.floor}`}</p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <p className="text-base font-bold">Elevetor: </p>
              {apartment.hasElevator ? (
                <Badge type="available" />
              ) : (
                <Badge type="not-available" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-base font-bold">Parking: </p>
              {apartment.hasParking ? (
                <Badge type="available" />
              ) : (
                <Badge type="not-available" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <strong className="font-bold">Size:</strong>{" "}
            <p className="italic">{`${apartment.size} sqft`}</p>
          </div>
          <div className="flex items-center gap-2">
            <strong className="font-bold">Rental Price:</strong>{" "}
            <p className="italic">
              {" "}
              ৳{apartment.rentalPrice.toLocaleString()}/month
            </p>
          </div>
        </div>
        <Separator />

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            // If not signed in, save state and redirect to sign in
            if (!session && typeof window !== "undefined") {
              window.sessionStorage.setItem(
                `Req-${apartment._id}`,
                JSON.stringify({ tenancyType, message })
              );

              router.push(
                `/signin?callbackUrl=${pathname}?modalId=${apartment._id}`
              );
              return;
            }
            setIsSubmitting(true);
            await SendRequest({
              apartmentId: apartment._id,
              tenancyType,
              message,
            });
            setIsSubmitting(false);
            // close modal after success
            router.push(pathname, { scroll: false });
          }}
          className="space-y-4"
        >
          <div className="flex gap-4 items-center">
            <Label className="font-bold" id={`tenancy-type-${apartment._id}`}>
              Request Type
            </Label>
            <RadioGroup
              aria-labelledby={`tenancy-type-${apartment._id}`}
              name="tenancyType"
              value={tenancyType}
              onValueChange={(val) =>
                setTenancyType(val as "bachelor" | "family")
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="bachelor"
                  id={`bachelor-${apartment._id}`}
                />
                <Label
                  className="font-normal"
                  htmlFor={`bachelor-${apartment._id}`}
                >
                  Bachelor
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="family" id={`family-${apartment._id}`} />
                <Label
                  className="font-normal"
                  htmlFor={`family-${apartment._id}`}
                >
                  Family
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1">
            <Label
              className="mb-2 font-bold"
              htmlFor={`message-${apartment._id}`}
            >
              Description
            </Label>
            <Textarea
              id={`message-${apartment._id}`}
              name="message"
              placeholder="Add a description..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
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
