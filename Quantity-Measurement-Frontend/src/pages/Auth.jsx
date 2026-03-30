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
    <div>
      {/* UI same rahega (tera code sahi hai) */}
      <button onClick={handleSubmit}>
        {isLogin ? "Login" : "Signup"}
      </button>
    </div>
  );
}