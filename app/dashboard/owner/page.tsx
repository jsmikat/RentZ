import { auth } from "@/auth";
import { ApartmentsTable } from "@/components/apartment-table";
import { GetOwnedApartments } from "@/lib/actions";

async function page() {
  const session = await auth();
  if (!session) {
    return <div>Please login to add an apartment</div>;
  }

  if (session.user.role !== "owner") {
    return (
      <div className="h-screen">
        <h1 className="h-full flex justify-center items-center text-4xl font-black">
          <span className="text-rose-500">Access denied:</span> You do not have
          permission to assess this page!
        </h1>
      </div>
    );
  }

  const { data } = await GetOwnedApartments(session.user.id);

  if (!data) {
    return <div>No apartments found</div>;
  }

  return (
    <ApartmentsTable
      relativePath="/dashboard/owner/apartment/"
      apartments={data.apartments}
    />
  );
}

export default page;
