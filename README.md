![](https://drive.google.com/uc?export=view&id=1NZ0my3DQ-EhN1mPOXIXyw5jTrLMveVtc)

---

# 🏠 Apartment Management System

A full-stack apartment management platform for building owners and tenants, built with **Next.js 15 App Router**, **TypeScript**, **MongoDB**, and **TailwindCSS**. The app streamlines rent management, leave requests, payment tracking, and allotment processes — all in one elegant, role-based dashboard.

## 📌 Features

### 🔐 Authentication & Role Management

- Secure login/signup for **owners** and **tenants**
- Role-based access control (RBAC) for user/owner views
- Password hashing and session management

### 🧑‍💼 Owner Features

- Allot apartment to a user
- Confirm/decline user payments
- View unpaid months
- View and respond to leave requests
- View payment memos with apartment & user details
- Dashboard overview of all apartments and tenant data

### 🧑‍💻 User Features

- View own apartment allotment info
- See due months (automatically calculated from allotment date)
- Submit rent payments (with method, transaction ID, etc.)
- Submit a leave request (only for months 2+ months in advance)
- View confirmed payments as professional memos

### 📄 Payment Management

- Only confirmed payments are stored in user’s payment history
- Payment status: `pending`, `confirmed`, `declined`
- Automatically determine unpaid months by comparing with history

### 📃 Memo System

- Each confirmed payment generates a clean, professional memo page
- Shows owner, user, apartment, and payment info
- Shareable and printable

### 📤 Leave Requests

- Tenants can request to leave an apartment (2 months ahead)
- Owners can accept/reject these requests
- Status: `pending`, `accepted`, `rejected`

---

## 🚀 Tech Stack

| Layer    | Stack                                      |
| -------- | ------------------------------------------ |
| Frontend | Next.js App Router, TypeScript, Tailwind   |
| Backend  | Node.js, MongoDB, Mongoose, Server Actions |
| UI       | Shadcn/ui components, Lucide icons         |
| Styling  | Tailwind CSS                               |
| Auth     | Auth.js                                    |

---

## 🛠️ Local Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/jsmikat/RentZ.git
cd RentZ
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root with the following:

```env
MONGODB_URI=mongodb+srv://<your-mongodb-url>
AUTH_SECRET=secret_key
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
