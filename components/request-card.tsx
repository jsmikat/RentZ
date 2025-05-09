"use client";

import { useRouter } from "next/navigation";

import { Phone, SquareUser } from "lucide-react";

import { AcceptRequest, RejectRequest } from "@/lib/actions";

import { Button } from "./ui/button";

export default function RequestCard({
  requestId,
  requestStatus,
  requesterName,
  phoneNumber,
  type,
  members,
  message,
}: {
  requestId: string;
  requestStatus: "pending" | "accepted" | "rejected";
  requesterName: string;
  phoneNumber: string;
  type: string;
  members: number;
  message: string;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2 border-1 border-primary p-4 rounded-md">
      <div className="flex gap-2 items-center">
        <SquareUser className="size-6" />
        <p>{requesterName}</p>
      </div>
      <div className="flex gap-2 items-center">
        <Phone className="size-6" />
        <p>{phoneNumber}</p>
      </div>
      <p>Type: {type}</p>
      <p>Members: {members}</p>
      <div className="border-1 border-primary p-2">{message}</div>
      {requestStatus === "pending" && (
        <div className="grid grid-flow-col gap-2">
          <Button
            onClick={async () => {
              await RejectRequest(requestId);
              router.refresh();
            }}
            variant="outline"
            className="w-full"
          >
            Reject
          </Button>
          <Button
            onClick={async () => {
              await AcceptRequest(requestId);
              router.refresh();
            }}
            variant="default"
            className="w-full"
          >
            Accept
          </Button>
        </div>
      )}
      {requestStatus === "accepted" && (
        <div className="w-full bg-green-50 p-2 text-center">
          <p className="text-green-700">Request Accepted</p>
        </div>
      )}
      {requestStatus === "rejected" && (
        <div className="w-full bg-rose-50 p-2 text-center">
          <p className="text-red-700">Request Rejected</p>{" "}
        </div>
      )}
    </div>
  );
}
