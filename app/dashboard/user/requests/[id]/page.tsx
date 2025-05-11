import { Phone, SquareUser } from "lucide-react";

import { auth } from "@/auth";
import { ApartmentDetails } from "@/components/apartment-card";
import RequestStatus from "@/components/request-confirm";
import { Badge } from "@/components/ui/badge";
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
            <RequestStatus requestId={data._id} status={data.requestStatus} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
