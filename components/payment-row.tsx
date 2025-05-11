"use client";

import { useRouter } from "next/navigation";

// optional: only if owners can delete
import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";

export function PaymentRow({ payment }: { payment: any }) {
  const router = useRouter();

  return (
    <TableRow>
      <TableCell>{payment.transactionId}</TableCell>
      <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
      <TableCell>{payment.amount}</TableCell>
      <TableCell>{dayjs(payment.monthOf).format("MMM, YYYY")}</TableCell>
      <TableCell>
        <Badge
          className={`rounded-full ${
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
    </TableRow>
  );
}
