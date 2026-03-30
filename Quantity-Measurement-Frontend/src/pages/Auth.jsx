import { useState } from "react";
import API from "../services/api";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const url = isLogin ? "/auth/login" : "/auth/signup";

    try {
      const res = await API.post(url, data);

      if (isLogin) {
        localStorage.setItem("token", res.data);
        window.location.href = "/dashboard";
      } else {
        alert("Signup successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert("Invalid credentials or error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 p-4">
      <div className="card w-full max-w-md glass animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-secondary-900 tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-secondary-500 mt-2 text-center">
            {isLogin ? "Enter your credentials to access your dashboard" : "Sign up to start measuring and comparing quantities"}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-secondary-700 ml-1">Username</label>
            <input
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-secondary-700 ml-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl bg-primary-600 text-white font-semibold shadow-lg shadow-primary-500/25 hover:bg-primary-700 transition-all active:scale-[0.98] mt-4 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isLogin ? "Login to Dashboard" : "Create Account"
            )}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-secondary-500">or</span>
            </div>
          </div>

          <p
            onClick={() => setIsLogin(!isLogin)}
            className="text-center text-secondary-600 cursor-pointer hover:text-primary-600 font-medium transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up now"
              : "Already have an account? Login here"}
          </p>
        </div>
      </div>
    </div>
  );
}