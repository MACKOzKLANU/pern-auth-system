import axios from "axios";
import { useState } from "react";

function RequestReset({ email, setEmail, setIsEmailSent }) {

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post("/api/auth/reset/request", {email: email});
            if (res.status === 200) {
                setIsEmailSent(true);
            }
        } catch (err) {
            setError("Error: " +  err.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Reset your password</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full mb-3" />

            <button
                type="submit"
                className="w-full px-4 py-2.5 rounded-lg 
                    bg-blue-600 text-white font-semibold
                    shadow-sm hover:shadow-lg 
                    hover:bg-blue-700 active:bg-blue-800
                    transition-all duration-200"
            >
                Send verification code
            </button>
        </form>
    )
}

export default RequestReset;