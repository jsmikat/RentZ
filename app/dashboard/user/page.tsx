import dayjs from "dayjs";

import { auth } from "@/auth";
import { PaymentsTable } from "@/components/payment-table";
import { Badge } from "@/components/ui/badge";
import { GetUnpaidMonths, GetUserPayments } from "@/lib/actions";

export default async function page() {
  const session = await auth();
  const payments = await GetUserPayments(session?.user.id);

  const dueMonths = await GetUnpaidMonths(
    payments.data?.payments[0].apartmentId._id
  );
  if (!session) {
    return (
      <p className="text-destructive text-center text-xl mt-20">
        No data found.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <DueMonthsList dueMonths={dueMonths} />
      <PaymentsTable payments={payments.data?.payments} />
    </div>
  );
}

export function DueMonthsList({ dueMonths }: { dueMonths: string[] }) {
  return (
    <div>
      <p className="font-medium">Due Months:</p>
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
