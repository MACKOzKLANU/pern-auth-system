import axios from "axios";
import { useState } from "react";

function VerifyResetOtp({ email, setIsOtpSubmitted }) {
    const [form, setForm] = useState({
        email: email,
        submittedCode: ""
    });

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            console.log(form.email)
            const res = await axios.post("/api/auth/reset/verify", form);
            if (res.status === 200) {
                setIsOtpSubmitted(true);
            }
        } catch (err) {
            setError("Error: " +  err.response.data.message);
        }
    };

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
        </form>
    )
}

export default VerifyResetOtp;