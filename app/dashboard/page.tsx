import { auth } from "@/auth";
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
    <div>
      <h1 className="text-6xl font-black">Your Apartments</h1>
      <div className="grid grid-cols-1 gap-4 mt-4">
        {data.apartments.map((apartment) => (
          <div key={apartment._id} className="border p-4 rounded-md shadow-md">
            <h2 className="text-2xl font-bold">{apartment.address.street}</h2>
            <p>{apartment.description}</p>
            <p>Price: {apartment.rentalPrice}</p>
            <p>Size: {apartment.size}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
