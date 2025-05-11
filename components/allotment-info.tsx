"use client";

import { useEffect, useState } from "react";

import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
import { GetUnpaidMonths } from "@/lib/actions";

export default function AllotmentInfo({ allottedTo, apartmentId }: any) {
  const [dueMonths, setDueMonths] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDueMonths() {
      try {
        const res = await GetUnpaidMonths(apartmentId);
        if (res) {
          setDueMonths(res);
        } else {
          setDueMonths([]);
        }
      } catch (err) {
        console.error("Failed to fetch due months", err);
        setDueMonths([]);
      } finally {
        setLoading(false);
      }
    }

    if (allottedTo && apartmentId) {
      fetchDueMonths();
    }
  }, [allottedTo, apartmentId]);

  if (!allottedTo) return <p className="text-muted-foreground">Not Allotted</p>;

  return (
    <div className="space-y-4 border rounded-xl p-4">
      <h2 className="text-lg font-semibold">Allotment Info</h2>
      <div>
        <p>
          <strong>Name:</strong> {allottedTo.name}
        </p>
        <p>
          <strong>Phone:</strong> {allottedTo.phoneNumber}
        </p>
        <p>
          <strong>NID:</strong> {allottedTo.nidNumber}
        </p>
      </div>

      <div>
        <p className="font-medium">Due Months:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {loading ? (
            <Badge variant="secondary">Loading...</Badge>
          ) : dueMonths && dueMonths.length > 0 ? (
            dueMonths.map((month) => (
              <Badge key={month} variant="destructive">
                {dayjs(month).format("MMMM YYYY")}
              </Badge>
            ))
          ) : (
            <Badge variant="default">No dues 🎉</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
