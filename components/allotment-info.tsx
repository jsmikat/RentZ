"use client";

import { useEffect, useState } from "react";

import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
import { GetLeaveRequest, GetUnpaidMonths } from "@/lib/actions";

export default function AllotmentInfo({ allottedTo, apartmentId }: any) {
  const [dueMonths, setDueMonths] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaveRequest, setLeaveRequest] = useState<any>(null);

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

    async function fetchLeaveRequest() {
      try {
        const res = await GetLeaveRequest(apartmentId);
        if (res) {
          setLeaveRequest(res.data?.leaveRequest);
        } else {
          setLeaveRequest(null);
        }
      } catch (err) {
        console.error("Failed to fetch leave request", err);
        setLeaveRequest(null);
      }
    }

    if (allottedTo && apartmentId) {
      fetchDueMonths();
      fetchLeaveRequest();
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
      {leaveRequest && (
        <div className="bg-rose-50 text-rose-700 p-4 text-2xl">
          <p>
            Leave request from:{" "}
            <Badge>{dayjs(leaveRequest.from).format("MMMM YYYY")}</Badge>
          </p>
        </div>
      )}
    </div>
  );
}
