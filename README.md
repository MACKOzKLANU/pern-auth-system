# 🚀 PERN Auth System — Full Authentication Flow (Email Verification + Password Reset)

A complete, production‑ready authentication system built with the **PERN stack** (PostgreSQL, Express, React, Node.js).  
This project demonstrates modern, secure authentication patterns including:

- **Email verification with OTP**
- **Password reset with OTP + short‑lived JWT**
- **Secure HTTP‑only cookies**
- **Hashed passwords (bcrypt)**
- **Fully responsive UI (Tailwind CSS)**

---

## 🛠 Tech Stack

### **Frontend**
- React (Vite)
- Tailwind CSS
- Axios (with credentials)

### **Backend**
- Node.js + Express.js
- PostgreSQL (pg)
- bcryptjs
- jsonwebtoken
- cookie-parser
- nodemailer

### **Security**
- HTTP‑only cookies
- JWT access tokens
- Short‑lived reset tokens (RESET_SECRET)
- OTP hashing with bcrypt
- Token expiration timestamps

---

## ✨ Features

### 🔐 Authentication
- Register new users
- Login with email + password
- Logout (clears auth cookie)
- Protected `/me` route using JWT cookie

### 📧 Email Verification
- OTP sent via email
- OTP hashed in DB
- Expiration timestamps
- Resend verification OTP
- Verified accounts stored as `is_verified`

### 🔄 Password Reset Flow
- Request reset → OTP emailed
- Verify OTP → issue short‑lived reset JWT
- Confirm new password → validate reset JWT

### 🛡 Security Highlights
- Passwords hashed with bcrypt
- OTPs hashed with bcrypt
- JWT stored in **HTTP‑only cookie**
- Reset JWT stored **only in frontend state/sessionStorage**
- Cookies configured for production security

---

## 📂 Project Structure
```
backend
├── config
│   ├── db.js                 # PostgreSQL connection
│   └── nodemailer.js         # SMTP transporter configuration
├── middleware
│   └── auth.js               # JWT protect middleware (reads cookie, loads user)
├── routes
│   └── auth.js               # All authentication, verification and reset routes
├── services
│   └── mailService.js        # Email sending logic (OTP, reset, welcome)
├── utils
│   └── tokens.js             # OTP generation, expiration helpers
├── server.js                 # Express server entry point
├── package.json
└── .gitignore

frontend
├── index.html
├── package.json
├── vite.config.js
├── src
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── assets/
│   ├── components
│   │   ├── Navbar.jsx
│   │   └── NotFound.jsx
│   ├── pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ResetPassword.jsx
│   │   └── Verify.jsx
│   └── resetPassword
│       ├── RequestReset.jsx
│       ├── VerifyResetOtp.jsx
│       └── SetNewPassword.jsx
└── public
    └── vite.svg
```
---

## ⚙️ Environment Variables

Create `backend/.env`:

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pern_auth
DB_USER=postgres
DB_PASSWORD=your_password

# Auth
JWT_SECRET=your_long_random_secret
RESET_SECRET=your_other_long_random_secret

# Frontend URL
CLIENT_URL=http://localhost:5173

# SMTP (email sending)
SMTP_USER=
SMTP_PASS=
SENDER_EMAIL=
```

**Important:**
- `JWT_SECRET` and `RESET_SECRET` **must be different**
- Never commit `.env`
- Use strong secrets in production

---

## 🧾 Database Schema

### Base table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Additional fields for verification + reset
```sql
ALTER TABLE users
  ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN verified_at TIMESTAMP,
  ADD COLUMN verification_code VARCHAR(128),
  ADD COLUMN verification_expires TIMESTAMP,
  ADD COLUMN reset_token VARCHAR(128),
  ADD COLUMN reset_expires TIMESTAMP;
```

---

## 📡 API Endpoints

### 🔹 **POST /api/auth/register**
Creates user, hashes password, generates OTP, sends email, sets auth cookie.

### 🔹 **POST /api/auth/verify**
Verifies email using OTP.

### 🔹 **POST /api/auth/resent-otp**
Resends verification OTP.

### 🔹 **POST /api/auth/login**
Validates credentials and sets JWT cookie.

### 🔹 **GET /api/auth/me**
Protected route — returns authenticated user.

### 🔹 **POST /api/auth/logout**
Clears auth cookie.

---

## 🔄 Password Reset Flow

### 1️⃣ **POST /reset/request**
- User enters email
- OTP generated + hashed
- OTP emailed

### 2️⃣ **POST /reset/verify**
- User submits OTP
- OTP validated
- OTP cleared from DB
- **Short‑lived reset JWT (10 min)** returned to frontend

### 3️⃣ **POST /reset/confirm**
- User submits new password + reset JWT
- JWT validated with `RESET_SECRET`
- Password updated

---

## 🔐 CORS & Cookies

Backend must allow credentials:

```js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

Frontend must send credentials:

```js
axios.post(url, data, { withCredentials: true });
```

---

## 🧩 Key Code Snippets

### Generate JWT
```js
jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
```

### Generate reset JWT
```js
jwt.sign({ email }, process.env.RESET_SECRET, { expiresIn: '10m' });
```

### Cookie options
```js
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 30 * 24 * 60 * 60 * 1000
};
```

---

## 🛡 Production Notes

- Always use HTTPS in production
- Set `secure: true` on cookies
- Add rate limiting (login, reset, register)
- Add input validation (email format, password strength)
- Add logging for failed attempts
- Never store plaintext OTPs
- Never store JWTs in localStorage

---

## 🧰 Troubleshooting

### Cookie not sent?
- Check `withCredentials: true`
- Check CORS origin
- Check SameSite settings
- Must use HTTPS in production

### OTP not working?
- Check expiration timestamps
- Ensure OTP is hashed before comparison

### Reset token invalid?
- Ensure `RESET_SECRET` is correct
- Ensure token not expired

---

## 🤝 Contributing

PRs and issues are welcome.  
Feel free to fork and build on top of this project.

---

## 📝 License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).
