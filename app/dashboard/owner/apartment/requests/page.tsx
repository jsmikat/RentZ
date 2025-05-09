import { auth } from "@/auth";
import { ApartmentsTable } from "@/components/apartment-table";
import { GetOwnerRequestedApartments } from "@/lib/actions";

async function page() {
  const session = await auth();
  if (!session) {
    return <div>Unauthorized</div>;
  }
  if (session?.user.role !== "owner") {
    return <div>Unauthorized</div>;
  }

  const requestedApartments = await GetOwnerRequestedApartments(
    session?.user?.id
  );
  return (
    <ApartmentsTable
      relativePath="/dashboard/owner/apartment/requests/"
      apartments={requestedApartments.data?.requests}
    />
  );
}

export default page;
