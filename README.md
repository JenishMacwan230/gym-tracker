# 🏋️ Fitness — Modern Gym & Facility Management Web Application

A full-stack, responsive web application and management system designed for fitness and gym facilities. It includes a public landing experience, admin tools for member and equipment management, and content editing features backed by MongoDB.

---

## 🌟 What the Application Does

The platform provides a polished public portal for visitors and a restricted admin dashboard for gym staff.

### Public Visitor Portal
- Hero section and booking call-to-action
- Services and training program showcase
- About page with founder and location details
- Photo gallery for facility highlights

### Admin Management System
- Member subscription tracking and renewal actions
- Equipment maintenance tracking
- About-page content editing
- Cloudinary-backed image uploads

---

## 🛠️ Tech Stack

### Frontend
- React 19 with Vite
- Vanilla CSS with a dark, glassmorphism-inspired design
- Framer Motion for animations
- Axios for HTTP requests

### Backend
- Node.js and Express 5
- MongoDB with Mongoose
- Cloudinary and Multer for uploads
- Dotenv and CORS

---

## 💻 Local Setup

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher
- MongoDB running locally or a reachable MongoDB instance

### 1. Clone the Repository

```bash
git clone https://github.com/JenishMacwan230/gym-tracker.git
cd gym-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a backend environment file named `.env` with placeholder values:

```env
PORT=5000
MONGO_URI=abc

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔑 Sample Admin Credentials

Use placeholder credentials for local development only:
- Username / Email: `admin` / `admin@example.com`
- Master Password: `changeme123`

---

## 📄 License

This project is licensed under the ISC License.
