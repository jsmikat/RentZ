"use client";

import { useRouter } from "next/navigation";

// optional: only if owners can delete
import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { PaymentConfirmation } from "@/lib/actions";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function PaymentRow({ payment }: { payment: any }) {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <TableRow>
      <TableCell>{payment.transactionId}</TableCell>
      <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
      <TableCell>{payment.amount}</TableCell>
      <TableCell>{dayjs(payment.monthOf).format("MMM, YYYY")}</TableCell>
      <TableCell>
        <Badge
          className={`rounded-full capitalize ${
            payment.status === "confirmed"
              ? "text-green-700 bg-green-100"
              : payment.status === "pending"
                ? "text-amber-700 bg-amber-100"
                : "text-rose-700 bg-rose-100"
          }`}
        >
          {payment.status}
        </Badge>
      </TableCell>
      <TableCell>
        {session?.user.role === "owner" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const request = await PaymentConfirmation(
                      payment._id,
                      "confirmed"
                    );
                    if (!request.success) {
                      toast.error("Payment confirmation failed");

                      return;
                    }
                    toast.success("Payment confirmed");
                    router.refresh();
                  }}
                  variant="default"
                  className="w-[8rem]"
                >
                  Confirm
                </Button>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const request = await PaymentConfirmation(
                      payment._id,
                      "declined"
                    );
                    if (!request.success) {
                      toast.error("Payment confirmation failed");

                      return;
                    }
                    toast.error("Payment Declined");
                    router.refresh();
                  }}
                  variant="destructive"
                  className="w-[8rem]"
                >
                  Decline
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : payment.status === "confirmed" ? (
          <Button
            onClick={async () => {
              router.push(
                new URL(
                  `/dashboard/user/${payment._id}`,
                  window.location.origin
                ).toString()
              );
            }}
            variant="default"
            className="w-[8rem]"
          >
            View Memo
          </Button>
        ) : null}
      </TableCell>
    </TableRow>
  );
}
