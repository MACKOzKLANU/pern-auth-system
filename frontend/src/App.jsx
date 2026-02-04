import { useState } from "react"
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me");
        setUser(res.data);
      } catch(err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if(loading) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser}></Navbar>
      <Routes>
        <Route path={"/"} element={<Home user={user} error={error}></Home>}></Route>
        <Route path={"/login"} element={<Login setUser={setUser}></Login>}></Route>
        <Route path={"/register"} element={<Register setUser={setUser}></Register>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
