// import { auth } from "@/auth";
// import { ApartmentDetails } from "@/components/apartment-card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { GetUserRequest } from "@/lib/actions";
// type Params = Promise<{ id: string }>;
// async function page({ params }: { params: Params }) {
//   const { id } = await params;
//   const { success, data } = await GetUserRequest(id);
//   if (!success) {
//     return <p className="text-destructive text-4xl"> No data </p>;
//   }
//   const session = await auth();
//   if (!session) {
//     if (session?.user.role !== "user") {
//       return (
//         <p className="text-destructive text-4xl">
//           {" "}
//           Unauthorised Access Request{" "}
//         </p>
//       );
//     }
//   }
//   return (
//     <div className="flex flex-col h-full px-4 md:px-8">
//       {data?.apartmentId && <ApartmentDetails apartment={data?.apartmentId} />}
//       <Separator orientation="horizontal" className="my-8" />
//       <Card className="w-full max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle className="text-2xl">Request Details</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex items-center justify-between">
//             <p className="font-medium">Request Type:</p>
//             <Badge variant="outline">{data?.type}</Badge>
//           </div>
//           <div className="flex items-center justify-between">
//             <p className="font-medium">Members:</p>
//             <span>{data?.members}</span>
//           </div>
//           <div>
//             <p className="font-medium mb-1">Additional Information:</p>
//             <p className="text-muted-foreground">{data?.additionalInfo}</p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
// export function RequestDetails(requestStatus: string) {
//   return (
//     <>
//       {requestStatus === "accepted" ? (
//         <Button>Confirm</Button>
//       ) : requestStatus === "rejected" ? (
//         <p className="text-rose-700 bg-rose-100 py-4 text-center text-4xl">
//           {" "}
//           Request Rejected{" "}
//         </p>
//       ) : (
//         <p className="text-amber-700 bg-amber-100 py-4 text-center text-4xl">
//           {" "}
//           Request Pending{" "}
//         </p>
//       )}
//     </>
//   );
// }
// export default page;
import { Phone, SquareUser } from "lucide-react";

import { auth } from "@/auth";
import { ApartmentDetails } from "@/components/apartment-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GetUserRequest } from "@/lib/actions";

type Params = Promise<{ id: string }>;

async function page({ params }: { params: Params }) {
  const { id } = await params;
  const { success, data } = await GetUserRequest(id);

  if (!success) {
    return (
      <p className="text-destructive text-center text-xl mt-20">
        No data found.
      </p>
    );
  }

  const session = await auth();

  if (!session || session?.user.role !== "user") {
    return (
      <p className="text-destructive text-center text-xl mt-20">
        Unauthorized Access
      </p>
    );
  }

  return (
    <div className="flex flex-col h-full px-4 md:px-8 py-6">
      {data?.apartmentId && <ApartmentDetails apartment={data.apartmentId} />}

      <Separator orientation="horizontal" className="my-10" />

      <Card className="w-full max-w-xl border border-muted rounded-2xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">
            Request Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-base text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Type</span>
            <Badge
              variant="outline"
              className="text-base text-muted-foreground border-2 capitalize"
            >
              {data?.type}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Members</span>
            <span>{data?.members}</span>
          </div>

          {data?.additionalInfo && (
            <div>
              <p className="font-medium text-foreground mb-1">
                Additional Info
              </p>
              <p className="leading-relaxed">{data.additionalInfo}</p>
            </div>
          )}
          {data?.requestStatus === "accepted" && (
            <>
              <Separator className="my-4" />
              <h2 className="text-2xl text-foreground font-medium">
                Owner Details
              </h2>
              <div className="flex gap-2 items-center">
                <SquareUser className="size-6" />
                <p>{data?.ownerId.name}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="size-6" />
                <p>{data?.ownerId.phoneNumber}</p>
              </div>
            </>
          )}

          <div className="pt-4">
            <RequestStatus status={data.requestStatus} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RequestStatus({ status }: { status: string }) {
  if (status === "accepted") {
    return (
      <>
        <Button className="w-full">Confirm</Button>
      </>
    );
  }

  const statusStyle =
    status === "rejected"
      ? "bg-rose-100 text-rose-700"
      : "bg-amber-100 text-amber-700";

  const label = status === "rejected" ? "Request Rejected" : "Request Pending";

  return (
    <div
      className={`w-full text-center py-3 rounded-md text-sm font-medium ${statusStyle}`}
    >
      {label}
    </div>
  );
}

export default page;
