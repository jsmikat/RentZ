import dayjs from "dayjs";

import { auth } from "@/auth";
import { PaymentsTable } from "@/components/payment-table";
import { Badge } from "@/components/ui/badge";
import {
  GetUnpaidMonths,
  GetUserPayments,
  isAllotedToApartment,
} from "@/lib/actions";

export default async function page() {
  const session = await auth();
  const isAlloted = await isAllotedToApartment(session?.user.id);
  if (!isAlloted) {
    return <p className="text-destructive text-4xl">No data found</p>;
  }

  const payments = await GetUserPayments(session?.user.id);

  if (!payments.data?.payments[0]) {
    return (
      <p className="text-destructive text-4xl">
        Make your payments to access everything
      </p>
    );
  }

  const dueMonths = await GetUnpaidMonths(
    payments.data?.payments[0].apartmentId._id
  );

  return payments ? (
    <div className="flex flex-col gap-8 p-4">
      <div className="border-2 p-4 rounded">
        <DueMonthsList dueMonths={dueMonths} />
      </div>

      <PaymentsTable payments={payments.data?.payments} />
    </div>
  ) : (
    <p className="text-emerald-700 bg-emerald-50 text-2xl text-center p-4">
      Welcome to your new home! 🎉
    </p>
  );
}

export function DueMonthsList({ dueMonths }: { dueMonths: string[] }) {
  return (
    <div>
      <p className="font-bold text-xl">Due Months:</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {dueMonths.length > 0 ? (
          dueMonths.map((month) => (
            <Badge key={month} variant="destructive">
              {dayjs(month).format("MMMM YYYY")}
            </Badge>
          ))
        ) : (
          <Badge variant="default">No dues 🎉</Badge>
        )}
      </div>
    </div>
  );
}
