export function getNavMain(role: "owner" | "user") {
  if (role === "owner") {
    return [
      {
        title: "Navigation",
        url: "#",
        items: [
          {
            title: "Add Apartment",
            url: "/dashboard/owner/apartment/create",
          },
          {
            title: "Requests",
            url: "/dashboard/owner/apartment/requests",
          },
          {
            title: "Payment Requests",
            url: "/dashboard/owner/apartment/payments",
          },
        ],
      },
    ];
  }

  if (role === "user") {
    return [
      {
        title: "Navigation",
        url: "#",
        items: [
          {
            title: "My Requests",
            url: "/dashboard/user/requests",
          },
          {
            title: "Submit Payment",
            url: "/dashboard/user/payment",
          },
          {
            title: "Leave Request",
            url: "/dashboard/user/leave",
          },
        ],
      },
    ];
  }

  // Fallback (e.g., unauthenticated or unknown role)
  return [];
}
