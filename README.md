

---


# 📚 Course Review Platform

A comprehensive web platform for managing, discovering, and reviewing academic courses. This application allows instructors to create and manage courses, while students can browse and leave valuable feedback. The platform also provides smart recommendations and sentiment analysis for better decision-making.

---

## 🚀 Features

### 👨‍🎓 For Students
- 🔍 Browse and search for courses
- 🏷️ Filter by department, difficulty level, and tags
- 📄 View course details and read student reviews
- 📝 Submit and edit reviews with ratings
- 🤖 Get personalized course recommendations

### 👩‍🏫 For Instructors
- ➕ Create and manage courses
- ✏️ Edit course details (title, description, difficulty, etc.)
- 📌 Add prerequisites and tags
- 📊 Access course analytics (ratings & sentiment)
- 💬 View feedback from students

### 🌐 Platform Features
- 🔐 Secure authentication with JWT
- 📱 Fully responsive (mobile + desktop)
- 🌙 Light and dark mode support
- 🧠 Sentiment analysis on reviews
- 🔎 Advanced search and filtering

---

## 🛠️ Technology Stack

### Frontend
- **React** with **Vite**
- **Chakra UI** for styling and theming
- **Redux Toolkit** with Persist
- **React Router** for routing
- **Axios** for HTTP requests

### Backend
- **Node.js** and **Express**
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Sentiment** npm package for sentiment analysis
- **Multer** for handling file uploads

---

## ⚙️ Getting Started

### ✅ Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd Course-Review-Platform
```

### 🔧 Backend Setup

```bash
cd backend
npm install
npm run dev
```

Update `.env` with your MongoDB URI and JWT secret.

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
Course-Review-Platform/
├── backend/
│   ├── config/         # DB configuration
│   ├── controllers/    # auth, course, review logic
│   ├── middleware/     # JWT auth, file uploads
│   ├── models/         # User, Course, Review schemas
│   ├── routes/         # API endpoints
│   └── index.js        # Entry point
│
└── front-end/
    ├── public/         
    └── src/
        ├── components/     # UI components
        ├── Pages/          # Page components
        ├── features/       # Redux slices
        ├── store/          # Redux store config
        └── main.jsx        # App entry
```

---

## 📡 API Endpoints

### 🔐 Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/getuser` - Get profile
- `PUT /api/auth/update` - Update profile
- `POST /api/auth/change-password` - Change password

### 📘 Courses
- `GET /api/courses` - All courses
- `GET /api/courses/:id` - Single course
- `POST /api/courses` - Create (Instructor only)
- `PUT /api/courses/:id` - Edit course
- `DELETE /api/courses/:id` - Delete course
- `GET /api/courses/instructor-courses` - Courses by instructor

### ⭐ Reviews
- `POST /api/reviews/submit` - Submit review
- `GET /api/reviews/user-reviews` - My reviews
- `GET /api/reviews/course/:id` - Course reviews
- `GET /api/reviews/course/:id/rating` - Course rating
- `GET /api/reviews/course/:courseId/check-review` - Check if reviewed

---



