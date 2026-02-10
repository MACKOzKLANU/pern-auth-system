import { Link } from "react-router-dom";

function Home({ user, error }) {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
                {error && <p className="bg-red-500">{error}</p>}
                {user ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome, {user.name}!</h2>
                        <p className="text-gray-600 mb-4">Email: {user.email}</p>
                        {!user.is_verified && <Link to={"/verify"} className="inline-flex items-center justify-center px-5 py-2.5 
                        rounded-lg font-semibold text-white 
                        bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                        shadow-sm hover:shadow-md transition-all duration-200">Verify your account</Link>}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Please log in or register.</h2>
                        <div className="flex flex-col gap-y-4">
                            <Link to={"/login"} className="w-full px-4 py-2.5 rounded-lg 
                                bg-blue-600 text-white font-semibold
                                shadow-sm hover:shadow-lg 
                                hover:bg-blue-700 active:bg-blue-800
                                transition-all duration-200">Login</Link>

                            <Link to={"/register"} className="w-full px-4 py-2.5 rounded-lg 
                                bg-gray-600 text-white font-semibold
                                shadow-sm hover:shadow-lg 
                                hover:bg-gray-700 active:bg-gray-800
                                transition-all duration-200">Register</Link>
                        </div>
                    </div>

                )}
            </div>
        </div>
    )
}

export default Home;