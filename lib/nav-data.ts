export function getNavMain(role: "owner" | "user") {
  if (role === "owner") {
    return [
      {
        title: "Navigation",
        url: "#",
        items: [
          {
            title: "Dashboard",
            url: "/dashboard/owner",
          },
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
          {
            title: "Rules & Regulations",
            url: "/dashboard/owner/rules",
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
            title: "Dashboard",
            url: "/dashboard/user",
          },
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
          {
            title: "Rules & Regulations",
            url: "/dashboard/user/rules",
          },
        ],
      },
    ];
  }

  // Fallback (e.g., unauthenticated or unknown role)
  return [];
}
