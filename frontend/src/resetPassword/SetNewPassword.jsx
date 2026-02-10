import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SetNewPassword({ email, resetToken }) {
    const [form, setForm] = useState({
        email: email,
        password: "",
        resetToken: resetToken
    })
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("/api/auth/reset/confirm", form);
            if (res.status === 200) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response.data.message);
        }
    }
    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Set your new password</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
                <input type="password" placeholder="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border p-2 w-full mb-3" />

            <button
                className="w-full px-4 py-2.5 rounded-lg 
                    bg-blue-600 text-white font-semibold
                    shadow-sm hover:shadow-lg 
                    hover:bg-blue-700 active:bg-blue-800
                    transition-all duration-200"
            >
                Save new password
            </button>
        </form>
    )
}

export default SetNewPassword;