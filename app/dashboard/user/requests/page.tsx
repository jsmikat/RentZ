import { auth } from "@/auth";
import { ApartmentsTable } from "@/components/apartment-table";
import { GetUserRequests } from "@/lib/actions";

async function page() {
  const session = await auth();

  const { success, data } = await GetUserRequests(session?.user.id);

  // — 3) Handle errors or no data
  if (!success || !data?.length) {
    return (
      <main className="p-6 text-center text-gray-600">
        You have not sent any apartment requests yet.
      </main>
    );
  }

  return (
    <ApartmentsTable requests={data} relativePath="/dashboard/user/requests/" />
  );
}

export default page;
