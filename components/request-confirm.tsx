"use client";

import { useState } from "react";

import { toast } from "sonner";

import { ConfirmRequest } from "@/lib/actions";

import { Button } from "./ui/button";

export default function RequestStatus({
  status,
  requestId,
}: {
  status: string;
  requestId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (status === "accepted") {
    return (
      <Button
        disabled={isSubmitting}
        onClick={async () => {
          setIsSubmitting(true);

          const data = await ConfirmRequest(requestId);
          data?.success
            ? toast.success("Request Confirmed")
            : toast.error("Request Failed");
          setIsSubmitting(false);
        }}
        className="w-full"
      >
        Confirm
      </Button>
    );
  }

  const statusStyle =
    status === "rejected"
      ? "bg-rose-100 text-rose-700"
      : "bg-amber-100 text-amber-700";

  const label = status === "rejected" ? "Request Rejected" : "Request Pending";

  return (
    <div
      className={`w-full text-center py-3 rounded-md text-sm font-medium ${statusStyle}`}
    >
      {label}
    </div>
  );
}
