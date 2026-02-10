import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { protect } from '../middleware/auth.js';
import transporter from '../config/nodemailer.js';
import { sendResetEmail, sendVerificationOtp, sendWelcomeEmail } from '../services/mailService.js';
import { generateOTP, getCurrentDate, isTokenExpired, tokenExpiry } from '../utils/tokens.js';

const router = express.Router();
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

// Register

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1',
        [email]
    );

    if (userExists.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = (await bcrypt.hash(password, 10));
    const otpPlain = generateOTP();

    const otpHash = await bcrypt.hash(otpPlain, 10)

    const otpExpires = tokenExpiry(0.5);
    const newUser = await pool.query(
        'INSERT INTO users (name, email, password, verification_code, verification_expires) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, is_verified',
        [name, email, hashedPassword, otpHash, otpExpires]
    );

    const token = generateToken(newUser.rows[0].id);

    res.cookie('token', token, cookieOptions);

    // Sending welcome email
    //  sendWelcomeEmail(email, name);

    // Sending verification OTP
    sendVerificationOtp(email, name, otpPlain)

    return res.status(201).json({ user: newUser.rows[0] });
})

router.post('/verify', async (req, res) => {

    const { email, submittedCode } = req.body;
    if (!submittedCode) {
        return res.status(400).json({ message: 'Please provide verification code' });
    }

    const user = await pool.query('SELECT is_verified, verification_code, verification_expires FROM users WHERE email = $1',
        [email]
    );

    const userData = user.rows[0] || null;

    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    else if (userData.is_verified) {
        return res.status(200).json({ message: 'Account Already verified' });
    }

    else if (isTokenExpired(userData.verification_expires)) {
        return res.status(401).json({ message: 'Token has expired' });
    }

    const isMatch = await bcrypt.compare(submittedCode, userData.verification_code);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid code' });
    }

    const verified_at = getCurrentDate()
    const updatedUser = await pool.query('UPDATE users SET is_verified=true, verification_code=NULL, verification_expires=NULL, verified_at=$2 WHERE email = $1 RETURNING id, name, email, is_verified',
        [email, verified_at]
    );

    const updatedUserData = updatedUser.rows[0];
    return res.status(200).json({ message: 'Verification successful', user: updatedUserData });

})

router.post('/resent-otp', async (req, res) => {
    const { email, name } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1',
        [email]
    );

    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const otpPlain = generateOTP();

    const otpHash = await bcrypt.hash(otpPlain, 10)

    const otpExpires = tokenExpiry(0.5);

    await pool.query('UPDATE public.users SET verification_code=$1, verification_expires=$2 WHERE email = $3',
        [otpHash, otpExpires, email]
    );

    sendVerificationOtp(email, name, otpPlain)


    return res.status(200).json({ message: "Verification code resent" });

})

// Login

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1',
        [email]
    );

    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userData = user.rows[0];

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(userData.id);

    res.cookie('token', token, cookieOptions);

    res.json({
        user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            is_verified: userData.is_verified
        }
    });
})

router.post('/reset/request', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const user = await pool.query('SELECT name FROM users WHERE email = $1',
        [email]
    );

    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const name = user.rows[0].name;

    const otpPlain = generateOTP();

    const otpHash = await bcrypt.hash(otpPlain, 10)

    const otpExpires = tokenExpiry(0.5);

    await pool.query('UPDATE users SET reset_token=$1, reset_expires=$2 WHERE email = $3',
        [otpHash, otpExpires, email]
    );

    sendResetEmail(email, name, otpPlain)

    return res.status(200).json({ message: "Verification code resent" });

})

router.post('/reset/verify', async (req, res) => {
    const { email, submittedCode } = req.body;

    if (!email || !submittedCode) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const user = await pool.query('SELECT reset_token, reset_expires FROM users WHERE email = $1',
        [email]
    );

    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userData = user.rows[0];

    if (isTokenExpired(userData.reset_expires)) {
        return res.status(401).json({ message: 'Token has expired' });
    }

    const isMatch = await bcrypt.compare(submittedCode, userData.reset_token);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid code' });
    }
    const resetJwt = jwt.sign(
        { email },
        process.env.RESET_SECRET,
        { expiresIn: "10m" }
    );


    return res.status(200).json({ message: 'Verification successful', resetToken: resetJwt });
})

router.post('/reset/confirm', async (req, res) => {
    const { email, password, resetToken } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1',
        [email]
    );

    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    try {
        const decoded = jwt.verify(resetToken, process.env.RESET_SECRET);

        if (decoded.email !== email) {
            return res.status(400).json({ message: "Invalid token" });
        }

        const hashedPassword = (await bcrypt.hash(password, 10));

        await pool.query('UPDATE users set password=$1, reset_token=NULL, reset_expires=NULL WHERE email = $2',
            [hashedPassword, email]
        );

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        return res.status(401).json({ message: "Reset token expired or invalid" });
    }
})

// Me
router.get('/me', protect, async (req, res) => {
    res.json(req.user);
    // return info of the logged in user from protect middleware
})

// Logout

router.post('/logout', (req, res) => {
    res.cookie('token', '', { ...cookieOptions, maxAge: 1 });
    res.json({ message: 'Logged out successfully' });
})

export default router;