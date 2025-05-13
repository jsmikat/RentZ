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

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="border-2 p-4 rounded">
        <DueMonthsList dueMonths={dueMonths} />
      </div>
      {payments.data?.payments[0].apartmentId && (
        <PaymentsTable payments={payments.data?.payments} />
      )}
    </div>
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
