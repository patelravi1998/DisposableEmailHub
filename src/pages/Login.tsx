import { useState } from "react";
import { Logo } from "../components/Logo";
import { Link } from "react-router-dom";
import { Navigation } from "../components/Navigation";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { toast } from 'sonner';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok && data.status) {
      const { token, user } = data.data; // Extract token and user details

      // Store data in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_email", user.email);
      console.log(`>>>>>user_id`,localStorage.getItem("user_email"))

      toast.success(`Login successful!`);

      window.location.href = "/";
    } else {
      toast.error(`${data.error.message}`);

    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Navigation />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-700 mt-4">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Log in to access your TempMail inbox
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300">
            Log In
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
