import { auth } from "@/auth";
import { ApartmentCard } from "@/components/apartment-card";
import { GetRequests } from "@/lib/actions";

async function page() {
  const session = await auth();
  if (!session) {
    return <div>Unauthorized</div>;
  }
  if (session?.user.role !== "owner") {
    return <div>Unauthorized</div>;
  }

  const requestedApartments = await GetRequests(session?.user?.id);
  return (
    <>
      {requestedApartments.data?.requests.map((apartment) => (
        <ApartmentCard apartment={apartment.apartment} />
      ))}
    </>
  );
}

export default page;
