"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        Cookies.set("token", data.token, {
          expires: rememberMe ? 7 : undefined,
          secure: true,
          sameSite: "Strict",
        });
        localStorage.setItem("role", JSON.stringify(data.user.roles));
        localStorage.setItem("id", data.user.id);
        window.location.href = "/";
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Check your email for password reset instructions.");
        setShowForgotPassword(false);
        
      } else {
        setForgotError(data.message || "Failed to send reset email.");
      }
    } catch (err) {
      setForgotError("An error occurred. Please try again later.");
    }
  };
  return (
    <div className="min-h-screen fixed w-full start-0 z-50 bg-gradient-to-br from-zinc-600 to-zinc-900 text-white lg:flex justify-center items-center p-4 gap-10">
      <ToastContainer />
      
      {/* Logo/Branding */}
      <div className="text-center mb-8  ">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
          TrendVerse
        </h1>
        <p className="text-gray-300 mt-2">Discover Trends, Stories & More</p>
        <h1 className="text-6xl" >😊</h1>
      </div>

      {/* Login Card */}
      <div className="bg-zinc-800/10 backdrop-blur-lg p-8 rounded-2xl shadow-md w-1/4 lg:mr-24 mr-0">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">
          Welcome Back 😊
        </h2>

        {error && (
          <div
            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full lg:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded border-gray-600"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
           
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition"
          >
           Sign In
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
            <h3 className="text-2xl font-bold text-center mb-6">Reset Password</h3>

            {forgotError && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="px-6 py-2.5 border text-gray-300 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
