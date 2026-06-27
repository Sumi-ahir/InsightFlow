import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/forgot-password",
        { email }
      );

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80 shadow-2xl rounded-lg border border-gray-300"
      >
        <h2 className="text-xl text-[#674188] font-bold mb-4 text-center">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="w-full bg-[#674188] text-white p-2 rounded cursor-pointer hover:bg-[#5a3870]">
          Send Reset Link
        </button>
              {message && (
          alert(message)
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;