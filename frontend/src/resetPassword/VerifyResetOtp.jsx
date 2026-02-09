import { useState } from "react";

function VerifyResetOtp() {
    const [form, setForm] = useState({
        email: "",
        name: "",
        submittedCode: ""
    })

    const [error, setError] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();

    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Enter verification code</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input type="email" placeholder="000000" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 w-full mb-3" />

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