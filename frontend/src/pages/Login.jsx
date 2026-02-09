import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/auth/login", form);
            setUser(res.data.user);
            navigate("/");

        } catch (err) {
            setError("Invalid email or password");
        }
    }

    const navigateToResetPassword = () => {
        navigate("/reset-password");
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
                <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input type="email" placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 w-full mb-3" />
                <input type="password" placeholder="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border p-2 w-full mb-3" />

                <button className="bg-blue-500 text-white p-2 w-full">Login</button>
                <button type="button" onClick={navigateToResetPassword} className={`w-full mt-3 px-4 py-2 font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-colors duration-200`}> Reset password </button>

            </form>
        </div>
    )
}

export default Login;