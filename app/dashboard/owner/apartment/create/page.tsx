import { auth } from "@/auth";
import ApartmentForm from "@/components/apartment-form";

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

  return <ApartmentForm />;
}

export default page;
