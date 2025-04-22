import { auth } from "@/auth";
import AddApartment from "@/components/create-apartment";

async function page() {
  const session = await auth();
  if (!session) {
    if (session?.user.role !== "owner") {
      return (
        <p className="text-destructive text-4xl">
          {" "}
          Unauthorised Access Request{" "}
        </p>
      );
    }
  }

  return <AddApartment />;
}

export default page;
