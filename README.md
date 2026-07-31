# 🏋️ Fitness — Modern Gym & Facility Management Web Application

A full-stack, responsive Web Application and Management System engineered for **Fitness & Gym Facilities**. Built with a sleek dark aesthetic, glassmorphism UI, real-time regex form validations, skeleton shimmer loading animations, Cloudinary image integration, and Admin Role-Based Access Control (RBAC).

---

## 🌟 What the Application Does

The **Fitness** platform provides both a high-converting public landing portal for prospective gym members and a powerful Admin Control Panel for gym owners and staff:

### 1. Public Visitor Portal
- **Hero & Action Banner**: Engaging hero section with direct *"Start Scheduling"* tour redirects to the contact section.
- **Training Tracks & Services**: Showcase strength training, HIIT conditioning, personal coaching, and recovery tracks.
- **About Us & Facility Gallery**: Interactive photo gallery featuring strength floors, cardio decks, functional turf, and luxury amenities.
- **Founder & Owner Profile**: Highlighting founder credentials, bio, and experience.
- **Direct Owner Contact & Location**: Integrated contact form and detailed gym opening hours with maps.

### 2. Admin Management System (Restricted Access)
- **Role-Based Access Control (RBAC)**: Non-admin visitors browse public content; member database and equipment management operations require Admin authentication.
- **Member Subscriptions Tracker**:
  - View member plans (Monthly, Quarterly, Annual), last payment dates, expiration statuses, and days remaining.
  - Prioritized view for expired memberships with instant 1-click **Renew** capability.
- **Equipment Maintenance Tracker**:
  - Track machines across zones (Cardio, Strength, Functional, Recovery) with service interval tracking and overdue maintenance alerts.
  - Dual View Modes: **Masonry Photo Bento Gallery** & **Detailed Data Table**.
  - Log maintenance completion with 1-click **Service Done**.
- **Live In-Place Content Management**: Admin edit modals for About Us sections (Hero, Location, Founder, and Gallery photos) saved directly to MongoDB.
- **Cloudinary Image Uploads**: Direct image upload support for facility photos and founder portraits.

---

## 🛠️ Security & UI Features

- **Regex Form Validation**: Enforces strict format checking across all forms:
  - **Email**: RFC 5322 pattern checking (`example@domain.com`).
  - **Name**: Letters, spaces, hyphens only (`2-50` characters).
  - **Phone**: Mobile phone formats (`+1 555-019-2831`).
  - **Serial Number & Username**: Alphanumeric codes (`3-30` characters).
- **Skeleton Shimmer Loading**: Reusable `<TableSkeleton />`, `<GallerySkeleton />`, and `<AboutUsSkeleton />` components for smooth asynchronous data fetching state transitions.
- **Single-Line Mobile Responsive Header**: Mobile layout optimized onto a single row (`[ ☰ ]` Left Hamburger, `[ 🏋️ Fitness ]` Center Title, `[ 🔑 Admin ]` Right Action Button).
- **Clean Footer**: Reusable `<Footer />` component with quick tab navigation and copyright bar.

---

## 🚀 Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS Design System with dark mode tokens, HSL colors & glassmorphism
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js & Express 5
- **Database**: MongoDB & Mongoose ORM (with in-memory fallback)
- **File Uploads**: Cloudinary API & Multer
- **Environment**: Dotenv & CORS

---

## 💻 Local Machine Setup Guide

Follow these step-by-step instructions to get the project running locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017` (Optional: If MongoDB is unavailable, the backend automatically uses persistent storage).

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/JenishMacwan230/gym-tracker.git
cd gym-tracker
```

---

### Step 2: Backend Configuration & Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create or verify the `.env` file inside `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/gym-tracker

   CLOUDINARY_CLOUD_NAME=dicfq01ln
   CLOUDINARY_API_KEY=766157624591535
   CLOUDINARY_API_SECRET=2T5mYVTahDn4u3sNyxuNczpG3xY
   ```

4. Start the Backend Server:
   ```bash
   npm run dev
   # OR
   npm start
   ```
   *The server will run on `http://localhost:5000`.*

---

### Step 3: Frontend Configuration & Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite Development Server:
   ```bash
   npm run dev
   ```
   *The application will open on `http://localhost:5173`.*

---

## 🔑 Default Admin Credentials

To access the Admin Management features and edit content:
- **Username / Email**: `Jenish230` / `jenishmacwan230@gmail.com`
- **Master Password**: `Jenish@230`

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Admin authentication | Public |
| `PUT` | `/api/auth/profile` | Update admin username, email, password | Yes |
| `GET` | `/api/members` | Fetch all members | Public |
| `POST` | `/api/members` | Add new member | Yes |
| `PUT` | `/api/members/:id/renew` | Renew member subscription | Yes |
| `DELETE`| `/api/members/:id` | Remove member record | Yes |
| `GET` | `/api/equipment` | Fetch all equipment machines | Public |
| `POST` | `/api/equipment` | Log new machine | Yes |
| `PUT` | `/api/equipment/:id/service` | Toggle machine service status | Yes |
| `GET` | `/api/about` | Fetch About Us content | Public |
| `PUT` | `/api/about` | Update About Us sections | Yes |
| `POST` | `/api/upload` | Upload image to Cloudinary | Public / Admin |

---

## 📄 License

This project is licensed under the **ISC License**. Built with ❤️ for champions.
