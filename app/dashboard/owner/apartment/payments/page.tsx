import { auth } from "@/auth";
import { PaymentsTable } from "@/components/payment-table";
import { GetOwnerPaymentRequests } from "@/lib/actions";

async function page() {
  const session = await auth();
  const paymentRequests = await GetOwnerPaymentRequests(session?.user.id);
  if (session?.user.role !== "owner") {
    return <div>Forbidden</div>;
  }

  if (paymentRequests.data?.payments.length === 0) {
    return (
      <p className="text-destructive text-center text-xl mt-20">
        No data found.
      </p>
    );
  }

  return <PaymentsTable payments={paymentRequests.data?.payments} />;
}

export default page;
