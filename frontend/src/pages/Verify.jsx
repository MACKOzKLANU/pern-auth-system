import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Verify({ user, setUser }) {
    const [form, setForm] = useState({
        email: user.email,
        submittedCode: ""
    })
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(() => {

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("/api/auth/verify", form);
            setUser(res.data.user);
            navigate("/");

        } catch (err) {
            setError("Verification failed: " + err.response.data.message);
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
                <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Verification</h2>
                <p className="text-center text-gray-800 mb-6">A verification code has been sent to your email ({user.email}). The code is valid for 30 minutes.</p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input type="number" placeholder="000000" value={form.submittedCode} onChange={(e) => setForm({ ...form, submittedCode: e.target.value })} className="border p-2 w-full mb-3 text-center" />

                <button className="bg-blue-500 text-white p-2 w-full">Verify email</button>
            </form>
        </div>
    )
}

export default Verify;