import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Auth() {

  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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
        navigate("/dashboard");
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4">

        <h2 className="text-2xl font-bold text-center">
          {isLogin ? "Login" : "Signup"}
        </h2>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-3 rounded-lg"
        >
          {isLogin ? "Login" : "Signup"}
        </button>

        <p
          className="text-center text-blue-500 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Switch to Signup" : "Switch to Login"}
        </p>

      </div>
    </div>
  );
}