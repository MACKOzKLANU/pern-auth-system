import axios from "axios";
import { useEffect, useState } from "react";

function VerifyResetOtp({ email, setIsOtpSubmitted, setResetToken }) {
    const [form, setForm] = useState({
        email: email,
        submittedCode: ""
    });

    const [error, setError] = useState("");
    const [cooldown, setCooldown] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            console.log(form.email)
            const res = await axios.post("/api/auth/reset/verify", form);
            if (res.status === 200) {
                setIsOtpSubmitted(true);
                setResetToken(res.data.resetToken);
            }
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleResentOTP = async (e) => {
        e.preventDefault();
        setError("");
        setCooldown(30);

        try {
            const res = await axios.post("/api/auth/reset/request", form);
        } catch (err) {
            setError("Resent verification code failed: " + err.response.data.message);
        }
    }

    useEffect(() => {
        setCooldown(60);
    }, [])

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Enter verification code</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input type="number" placeholder="000000" value={form.submittedCode} onChange={(e) => setForm({ ...form, submittedCode: e.target.value })} className="border p-2 w-full mb-3" />

            <button
                className="w-full px-4 py-2.5 rounded-lg 
                    bg-blue-600 text-white font-semibold
                    shadow-sm hover:shadow-lg 
                    hover:bg-blue-700 active:bg-blue-800
                    transition-all duration-200"
            >
                Verify code
            </button>
            <button type="button" disabled={cooldown > 0} onClick={handleResentOTP} className={`w-full mt-3 px-4 py-2 font-medium rounded-lg ${cooldown > 0 ? "text-gray-800 bg-gray-50 hover:bg-gray-100 active:bg-gray-200" : "text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200"} transition-colors duration-200`}> {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification code"} </button>

        </form>
    )
}

export default VerifyResetOtp;