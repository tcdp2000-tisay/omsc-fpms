 
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
 
export default function Login() {
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
const [successMsg, setSuccessMsg] = useState("");

useEffect(() => {
  const msg = localStorage.getItem("success");

  if (msg) {
    setSuccessMsg(msg);
    localStorage.removeItem("success"); // para once lang lumabas
  }
}, []);

const login = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("/api/login", {
      email,
      password,
    });

    
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Login success");

   
    navigate("/dashboard");

  } catch {
    alert("Invalid login");
  }
};

  return (
    <div
        className="h-screen w-screen overflow-hidden flex items-center justify-center bg-cover bg-center"      style={{ backgroundImage: "url('/images/bg.jpg')" }}
    >
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md">

{/* SUCCESS MESSAGE */}
      {successMsg && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded text-center">
          {successMsg}
        </div>
      )}

        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img src="/images/logo.png" className="w-20 h-20" />
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center">Login</h2>

       <form
  onSubmit={login}
  className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md"
>
 

  <input
    type="email"
    placeholder="Email address"
    className="w-full mb-4 border-b border-gray-400 focus:outline-none py-2 bg-transparent"
    onChange={(e) => setEmail(e.target.value)}
  />

  <input
    type="password"
    placeholder="Password"
    className="w-full mb-4 border-b border-gray-400 focus:outline-none py-2 bg-transparent"
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="submit"
    className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800"
  >
    LOGIN
  </button>

  <p className="text-center text-sm mt-4">
    Don't have an account?{" "}
    <Link to="/signup">
      <span className="text-blue-600 cursor-pointer">Sign Up</span>
    </Link>
  </p>
</form>


      </div>
    </div>
  );
}