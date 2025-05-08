import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "../components/Navigation";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
import { toast } from 'sonner';
import { Footer } from '../components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Password reset link sent to your email");
        setResetSent(true);
      } else {
        toast.error(data.error?.message || "Failed to send reset link");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Navigation />
      <main className="flex-grow flex items-center justify-center p-4 mt-16">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
            <p className="text-gray-600">
              {resetSent 
                ? "Check your email for the reset link" 
                : "Enter your email to receive a reset link"}
            </p>
          </div>
          
          {!resetSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
        <div className="text-center">
          <p className="mb-4">
            We've sent a password reset link to your email address.
            <br />
            <span className="text-red-600 font-medium text-sm">
              If you don't see the email in your inbox, please check your spam or junk folder.
            </span>
          </p>
          <Link 
            to="/login" 
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </div>

          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;