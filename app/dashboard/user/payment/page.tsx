import { auth } from "@/auth";
import PaymentForm from "@/components/payment-form";
import { GetUserAllottedApartment } from "@/lib/actions";

async function page() {
  const session = await auth();
  const userId = session?.user.id;

  const apartment = await GetUserAllottedApartment(userId);
  if (!apartment.success) {
    return (
      <p className="text-destructive text-center text-xl mt-20">
        No data found.
      </p>
    );
  }
  console.log(
    "=====================+=======================++==================",
    apartment.data?.apartment
  );
  return <PaymentForm apartmentId={apartment.data?.apartment._id} />;
}

export default page;
