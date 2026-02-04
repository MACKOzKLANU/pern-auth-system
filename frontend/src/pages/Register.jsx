import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register({ setUser }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [error, setError] = useState("");
    const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post("http://localhost:3000/api/auth/register", form);
        setUser(res.data);
        navigate("/");

    } catch (err) {
        setError("Registration failed");
    }
}

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl mb-4">Register</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input type="text" placeholder="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 w-full mb-3" />
                <input type="email" placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 w-full mb-3" />
                <input type="password" placeholder="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border p-2 w-full mb-3" />

                <button className="bg-blue-500 text-white p-2 w-full">Register</button>
            </form>
        </div>
    )
}

export default Register;