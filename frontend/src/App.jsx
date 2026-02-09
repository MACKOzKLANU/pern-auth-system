import { useState } from "react"
import { BrowserRouter, Navigate, Route, Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect } from "react";
import axios from "axios";
import NotFound from "./components/NotFound";
import Verify from "./pages/Verify";
import ResetPassword from "./pages/ResetPassword";

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setUser(res.data);
        console.log(res.data);
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
        <Route path={"/login"} element={user ? <Navigate to={"/"}></Navigate> : <Login setUser={setUser}></Login>}></Route>
        <Route path={"/register"} element={user ? <Navigate to={"/"}></Navigate> : <Register setUser={setUser}></Register>}></Route>
        <Route path={"/verify"} element={(user && !user.is_verified) ? <Verify user={user} setUser={setUser}></Verify> :   <Navigate to={"/"}></Navigate>}></Route>
        <Route path={"/reset-password"} element={<ResetPassword></ResetPassword>}></Route>
        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
