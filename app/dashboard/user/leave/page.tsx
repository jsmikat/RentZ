import { auth } from "@/auth";
import LeaveRequestForm from "@/components/leave-request";
import { GetApartmentId } from "@/lib/actions";

async function page() {
  const session = await auth();
  const apartment = await GetApartmentId(session?.user?.id);
  return <LeaveRequestForm apartmentId={apartment.data?.apartmentId} />;
}

export default page;
