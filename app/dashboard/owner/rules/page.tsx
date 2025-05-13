export default function OwnerRules() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🏠 Owner Guidelines</h1>

      <div className="space-y-6 text-sm leading-6 text-muted-foreground">
        <div>
          <h2 className="text-base font-semibold text-primary">
            1. Apartment Management
          </h2>
          <ul className="list-disc list-inside">
            <li>You can add, edit, and delete apartments.</li>
            <li>Make sure apartment details are accurate and up-to-date.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-primary">
            2. Request Handling
          </h2>
          <ul className="list-disc list-inside">
            <li>View and manage apartment booking requests from users.</li>
            <li>
              Approve or decline requests responsibly and in a timely manner.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-primary">
            3. Payment Confirmation
          </h2>
          <ul className="list-disc list-inside">
            <li>Only confirm payments after verifying all details.</li>
            <li>
              Confirmed payments will be added to the user's payment history.
            </li>
            <li>A memo will be generated for each confirmed payment.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-primary">
            4. Leave Requests
          </h2>
          <ul className="list-disc list-inside">
            <li>Users may submit leave requests two months in advance.</li>
            <li>Review and respond to leave requests promptly.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
