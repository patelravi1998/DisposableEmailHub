import { useState } from "react";
import { Logo } from "../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "../components/Navigation";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { toast } from 'sonner';


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook to redirect after signup

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok && data.status) {
      toast.success(`Signup successful! Please log in.`)
      localStorage.setItem("signupReferenceId", data.referenceId); // Store reference ID
      navigate("/login"); // Redirect to login page
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
          Create an Account
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign up to get started with TempMail
        </p>
        <form onSubmit={handleSignup} className="space-y-4">
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
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
