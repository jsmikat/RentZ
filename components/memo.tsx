import { format } from "date-fns";

import { GetPaymentMemoData } from "@/lib/actions";

export default function Memo({
  data,
}: {
  data: Awaited<ReturnType<typeof GetPaymentMemoData>>;
}) {
  const { user, apartment, owner, payment } = data;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg border border-gray-300 rounded-xl font-sans">
      <header className="mb-6 border-b pb-4 flex flex-col justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">RentZ Payment Memo</h1>
        <div className="text-sm text-gray-600 text-center">
          <p>Digitally Generated Memo</p>
        </div>
      </header>

      <section className="mb-6">
        <h2 className="font-semibold text-lg text-gray-800 mb-2">
          Payment Information
        </h2>
        <div className="text-gray-700 space-y-1">
          <p>
            <strong>Month:</strong> {payment.monthOf}
          </p>
          <p>
            <strong>Amount:</strong> ৳{payment.amount}
          </p>
          <p>
            <strong>Method:</strong> {payment.method}
          </p>
          <p>
            <strong>Transaction ID:</strong> {payment.transactionId}
          </p>
          <p>
            <strong>Submitted At:</strong>{" "}
            {format(new Date(payment.paidAt), "PPPp")}
          </p>
          <p>
            <strong>Confirmed At:</strong>{" "}
            {format(new Date(payment.confirmedAt), "PPPp")}
          </p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold text-lg text-gray-800 mb-2">
          Apartment Details
        </h2>
        <div className="text-gray-700 space-y-1">
          <p>
            <strong>Address:</strong> {apartment.address.street},{" "}
            {apartment.address.area}, {apartment.address.city}
          </p>
          <p>
            <strong>Rent:</strong> ৳{apartment.rentalPrice}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-6 border-t pt-6 text-gray-700">
        <div>
          <h3 className="font-medium text-gray-800 mb-1">Submitted By</h3>
          <p>{user.name}</p>
          <p>{user.phoneNumber}</p>
        </div>

        <div className="place-self-end text-right">
          <h3 className="font-medium text-gray-800 mb-1">Confirmed By</h3>
          <p>{owner.name}</p>
          <p>{owner.phoneNumber}</p>
        </div>
      </section>
    </div>
  );
}
