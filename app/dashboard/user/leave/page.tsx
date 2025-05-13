import { auth } from "@/auth";
import LeaveRequestForm from "@/components/leave-request";
import { GetApartmentId, hasSentLeaveRequest } from "@/lib/actions";

async function page() {
  const session = await auth();
  const apartment = await GetApartmentId(session?.user?.id);
  const hasSent = await hasSentLeaveRequest(
    apartment.data?.apartmentId,
    session?.user?.id
  );
  return hasSent.data?.hasSentLeaveRequest ? (
    <p className="bg-rose-50 text-2xl text-rose-700 p-4">
      You have already sent a request
    </p>
  ) : (
    <LeaveRequestForm apartmentId={apartment.data?.apartmentId} />
  );
}

export default page;
