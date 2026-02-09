import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Verify({ user, setUser }) {
    const [form, setForm] = useState({
        email: user?.email,
        name: user?.name,
        submittedCode: ""
    })
    const [error, setError] = useState("");
    const [cooldown, setCooldown] = useState(0);

    const navigate = useNavigate();
    useEffect(() => {

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")

        try {
            const res = await axios.post("/api/auth/verify", form);
            console.log(res.data.user)
            setUser(res.data.user);
            navigate("/");

        } catch (err) {
            setError("Verification failed: " + err.response.data.message);
        }
    }

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleResentOTP = async (e) => {
        e.preventDefault();
        setError("")
        setCooldown(30);

        try {
            const res = await axios.post("/api/auth/resent-otp", form);

        } catch (err) {
            setError("Resent verification code failed: " + err.response.data.message);
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
                <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Verification</h2>
                <p className="text-center text-gray-800 mb-6">A verification code has been sent to your email ({user?.email}). The code is valid for 30 minutes.</p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input type="number" placeholder="000000" value={form.submittedCode} onChange={(e) => setForm({ ...form, submittedCode: e.target.value })} className="border p-2 w-full mb-3 text-center" />

                <button
                    className="w-full px-4 py-2.5 rounded-lg 
                    bg-blue-600 text-white font-semibold
                    shadow-sm hover:shadow-lg 
                    hover:bg-blue-700 active:bg-blue-800
                    transition-all duration-200"
                >
                    Verify email
                </button>
                <button type="button" disabled={cooldown > 0} onClick={handleResentOTP} className={`w-full mt-3 px-4 py-2 font-medium rounded-lg ${cooldown > 0 ? "text-gray-800 bg-gray-50 hover:bg-gray-100 active:bg-gray-200" : "text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200"} transition-colors duration-200`}> {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification code"} </button>
            </form>
        </div>
    )
}

export default Verify;