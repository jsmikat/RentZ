import { Fragment } from "react";

import { auth } from "@/auth";
import { ApartmentCard } from "@/components/apartment-card";
import { GetRequests } from "@/lib/actions";

async function page() {
  const session = await auth();

  const { success, data } = await GetRequests(session?.user.id);
  console.log("Data:\n", data);

  // — 3) Handle errors or no data
  if (!success || !data?.length) {
    return (
      <main className="p-6 text-center text-gray-600">
        You have not sent any apartment requests yet.
      </main>
    );
  }

  return (
    <Fragment>
      {data.map((req: any) => (
        <ApartmentCard
          key={req.apartmentId + Math.random()}
          apartment={req.apartmentId}
          className="border-0 shadow-none"
        />
      ))}
    </Fragment>
  );
}

export default page;
