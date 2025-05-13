"use client";

export default function UserRules() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">👤 User Guidelines</h1>

      <div className="space-y-6 text-sm leading-6 text-muted-foreground">
        <div>
          <h2 className="text-base font-semibold text-primary">
            1. Apartment Requests
          </h2>
          <ul className="list-disc list-inside">
            <li>You can request to book available apartments.</li>
            <li>Wait for the owner's approval before making any payment.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-primary">
            2. Payment Process
          </h2>
          <ul className="list-disc list-inside">
            <li>Submit payment with valid transaction details.</li>
            <li>Payments remain pending until confirmed by the owner.</li>
            <li>You will receive a memo for each confirmed payment.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-primary">
            3. Leave Requests
          </h2>
          <ul className="list-disc list-inside">
            <li>
              You may submit a leave request at least 2 months in advance.
            </li>
            <li>
              Provide a valid reason and additional information if needed.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-primary">
            4. Payment History
          </h2>
          <ul className="list-disc list-inside">
            <li>You can view all your confirmed payments and due months.</li>
            <li>Stay up to date to avoid any dues.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
