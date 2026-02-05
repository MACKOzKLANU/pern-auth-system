# 🚀 PERN Auth System (Authentication Example)

A professional, industry-standard authentication system built with the **PERN stack** (PostgreSQL, Express, React, Node.js). This project demonstrates modern development practices for authentication flows using JWTs, secure HTTP-only cookies, hashed passwords with bcrypt, and a responsive UI using Tailwind CSS.

## 🛠 Tech Stack

* **Frontend:** React (Vite), Tailwind CSS  
* **Backend:** Node.js, Express.js  
* **Database:** PostgreSQL  
* **Auth / Security:** jsonwebtoken, bcryptjs, cookie-parser  
* **Tools:** Nodemon, dotenv

## ✨ Key Features

- **Register:** Create a new user account and receive a JWT set in an HTTP-only cookie.  
- **Login:** Authenticate with email + password; receive JWT cookie and user info.  
- **Logout:** Clear authentication cookie.  
- **Protected routes:** Example `/me` route that returns the current user when authenticated.  
- **Secure cookies:** Cookie options configured for httpOnly, sameSite, maxAge and secure in production.  
- **Password hashing:** Passwords are hashed with bcrypt before storage.

## 📂 Project Structure

- `/frontend` — React application (Vite + Tailwind)  
- `/backend` — Express API, database connection and auth routes  
- `.env` files live in the backend (see Environment Variables section)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/MACKOzKLANU/pern-auth-system.git
cd pern-auth-system
```

### 2. Backend setup
1. Go to backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/` with the variables shown below.
4. Start the backend server (development):
   ```bash
   npx nodemon server.js
   ```
   Or add scripts to `backend/package.json`:
   ```json
   "scripts": {
     "dev": "nodemon server.js",
     "start": "node server.js"
   }
   ```

### 3. Frontend setup
1. Open a new terminal and go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend dev server:
   ```bash
   npm run dev
   ```
   Vite commonly serves at `http://localhost:5173`.

---

## ⚙️ Environment variables

Create a `.env` file inside the `backend/` folder. Do NOT commit this file to source control.

Below is an example `.env` file you can copy into `backend/.env` and then update with your real values:

```env
# Server
PORT=3000

# Database (Postgres)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pern_auth
DB_USER=postgres
DB_PASSWORD=prog2137

# Auth
JWT_SECRET=123456

# Frontend (for CORS / reset links)
CLIENT_URL=http://localhost:5173

# SMTP (for sending verification and reset emails)
SMTP_USER=             # e.g. your SMTP username or email (leave blank here)
SMTP_PASS=             # e.g. your SMTP password (leave blank here)
SENDER_EMAIL=          # e.g. "No Reply <no-reply@yourdomain.com>"
```

Important:
- Replace placeholder values (like `prog2137`, `123456`, blank SMTP fields) with secure, real values for development or production.
- Keep `.env` out of version control. Add `backend/.env` to `.gitignore` if it is not already ignored.
- For production, use a secure `JWT_SECRET` and secure SMTP credentials. Serve over HTTPS and set `secure: true` for cookies in production.

---

## 🧾 Database Schema (users table)

Run these SQL commands in your PostgreSQL database:

```sql
CREATE DATABASE pern_auth;

\c pern_auth

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

If you add email verification and password reset features, add these columns:

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

## 📡 API Endpoints (backend/routes/auth.js)

- POST `/api/auth/register`
  - Body: `{ name, email, password }`
  - Creates a new user, returns user object and sets `token` cookie.

- POST `/api/auth/login`
  - Body: `{ email, password }`
  - Validates credentials, returns user object and sets `token` cookie.

- GET `/api/auth/me`
  - Protected route using `protect` middleware (reads JWT from cookie).
  - Returns the authenticated user's info.

- POST `/api/auth/logout`
  - Clears the `token` cookie and returns a success message.

(Confirm base path in `server.js` — e.g., `app.use('/api/auth', authRoutes)`)

---

## 🔐 CORS, Cookies & Client Requests

To allow cookies across frontend and backend in development, enable CORS with credentials on the server:

```js
import cors from 'cors';
import cookieParser from 'cookie-parser';

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(cookieParser());
```

When calling the API from the frontend, include credentials:

axios example:
```js
axios.post('/api/auth/login', { email, password }, { withCredentials: true });
axios.get('/api/auth/me', { withCredentials: true });
```

fetch example:
```js
fetch('/api/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

Ensure in production you serve over HTTPS and set `cookieOptions.secure = true`.

---

## 🧩 Example key snippets

- Generating a JWT:
```js
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
```

- Sample cookie options used in backend:
```js
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
};
```

- Hashing a password with bcrypt:
```js
const hashedPassword = await bcrypt.hash(password, 10);
```

---

## 🛡 Security & Production Notes

- Keep `JWT_SECRET` out of source control.
- Use HTTPS in production and set `secure: true` on cookies.
- Consider short-lived access tokens + refresh tokens for stricter security.
- Add input validation and rate limiting to reduce abuse.
- Store only required fields in the JWT; avoid placing sensitive data in tokens.
- For reset tokens, consider storing a hashed token in the DB (sha256) instead of plaintext for better security.

---

## 🧰 Troubleshooting

- "Cannot connect to database": verify `.env` values and that PostgreSQL is running.
- "Cookie not set / not sent": ensure `axios`/`fetch` uses credentials and backend `cors` allows credentials and correct origin.
- JWT errors: ensure `JWT_SECRET` is consistent between runs.
- Email sending fails: check SMTP credentials (`SMTP_USER`, `SMTP_PASS`) and SMTP host/port (if using a provider you may need to allow less secure apps or create an app password).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Open an issue or submit a PR with clear details and tests when applicable.

---

## 📝 License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).
