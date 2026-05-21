import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const register = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    setLoading(true);
    setErrors({});

    await axios.post("/api/register", {
      name,
      email,
      password,
      password_confirmation: confirmPassword,
    });

    setLoading(false);

    // ✅ SUCCESS MESSAGE
    localStorage.setItem("success", "Registered successfully!");

    // ✅ GO BACK TO LOGIN
    navigate("/");

  } catch (err) {
    setLoading(false);

    if (err.response?.status === 422) {
      setErrors(err.response.data.errors);
    } else {
      alert("Registration failed");
    }
  }
};

  return (
    <div
      className="h-screen w-screen overflow-hidden flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/images/logo.png" className="w-20 h-20" />
        </div>

        <h2 className="text-center text-xl font-semibold mb-6">
          Sign Up
        </h2>

        <form onSubmit={register}>

          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            className="w-full mb-2 border-b bg-transparent outline-none py-2"
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mb-2">{errors.name[0]}</p>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-2 border-b bg-transparent outline-none py-2"
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email[0]}</p>
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-2 border-b bg-transparent outline-none py-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">{errors.password[0]}</p>
          )}

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full mb-4 border-b bg-transparent outline-none py-2"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 rounded-md"
          >
            {loading ? "Signing up..." : "SIGN UP"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/">
            <span className="text-blue-600 cursor-pointer">
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}