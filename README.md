# Authentication App

User authentication application built with React + TypeScript + Node.js

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Frontend
npm install

```

### 2. Environment Setup

**Frontend (.env):**

```env
VITE_API_BASE_URL=http://localhost:3000
```

**Backend (backend/.env):**

```env
PORT=3000
JWT_SECRET=your-secret-key-here
```

### 3. Run Application

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 📱 Features

- ✅ User Registration/Login
- ✅ JWT Protected Routes
- ✅ Dashboard after Authentication
- ✅ Responsive UI with Tailwind CSS

## 🧪 Test Ready

Key buttons include `data-testid` attributes:

- `create-btn` - Account creation button
- `login-btn` - Login button
- `logout-btn` - Logout button

## 📦 Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, Zustand
**Backend:** Node.js, Express, JWT, bcryptjs

## ⚠️ Notes

- Backend uses in-memory storage (data will be lost on restart)
- For production, replace with a real database
