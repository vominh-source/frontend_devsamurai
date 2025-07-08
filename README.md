# Authentication App

Modern user authentication application with automatic token refresh functionality

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Frontend
npm install

```

### 2. Run Application

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: Make sure your backend is running on http://localhost:3000

## 📱 Features

- ✅ **User Registration/Login** - Complete auth flow
- ✅ **JWT Protected Routes** - Secure route protection
- ✅ **Automatic Token Refresh** - Seamless token renewal
- ✅ **Dashboard after Authentication** - Protected user area
- ✅ **Responsive UI** - Mobile-friendly with Tailwind CSS
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Loading States** - User feedback during operations

## 🔄 Token Refresh Implementation

### Automatic Refresh Flow

```
API Request (expired token) → 401 Error → Auto Refresh → Retry Request → Success
```

### Key Features

- **Transparent**: Apps don't need to handle refresh manually
- **Resilient**: Auto-recovery from expired tokens
- **Secure**: Proper cleanup on refresh failure
- **No Infinite Loops**: Smart retry prevention

### Backend Requirements

Your backend should provide these endpoints:

```bash
POST /auth/signup    # Returns: { access_token, refresh_token }
POST /auth/signin    # Returns: { access_token, refresh_token }
POST /auth/refresh   # Returns: { access_token, refresh_token }
GET  /users/me       # Returns: user object
```

## 🧪 Test Ready

Key buttons include `data-testid` attributes:

- `create-btn` - Account creation button
- `login-btn` - Login button
- `logout-btn` - Logout button

## 📦 Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, Zustand, Axios

**Key Libraries:**

- **Zustand** - State management
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## 🔧 Architecture

### Authentication Flow

1. **Login/Signup** → Get tokens from backend
2. **Store Tokens** → localStorage (access_token + refresh_token)
3. **Fetch User Data** → GET /users/me with access_token
4. **Auto Refresh** → Axios interceptor handles token refresh
5. **Logout** → Clear all tokens and redirect

### File Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── store/         # Zustand auth store
├── services/      # API client with interceptors
├── types/         # TypeScript interfaces
└── schemas/       # Zod validation schemas
```

## ⚠️ Backend Integration Notes

- **Response Format**: Backend must return `{ access_token, refresh_token }`
- **No User Object**: Frontend fetches user data separately via `/users/me`
- **Refresh Endpoint**: Must accept refresh_token in Authorization header
- **CORS**: Make sure backend allows frontend origin

## 🚀 Production Considerations

- Replace localStorage with httpOnly cookies for better security
- Implement refresh token rotation
- Add rate limiting for auth endpoints
- Use HTTPS in production
- Consider implementing logout endpoint to invalidate tokens
