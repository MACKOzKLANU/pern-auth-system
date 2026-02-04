import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await axios.post("http://localhost:3000/api/auth/logout");
        setUser(null);
        navigate("/");

    }
    return (
        <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
            <Link to={"/"} className="font-bold">PERN Auth</Link>
            <div>
                {user ? (
                    <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
                ) : (
                    <>
                    <Link to={"/login"} className="mx-2">Login</Link>
                    <Link to={"/register"} className="mx-2">Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar;