import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";


const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setMessage("Password required");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/api/auth/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);

      // redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded w-80 shadow-2xl border border-gray-300 rounded-lg">
        <h2 className="text-lg text-[#674188] font-bold mb-3 text-center">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          className="border p-2 mb-3 w-full rounded border-[#674188] focus:ring-2 focus:ring-[#674188] focus:border-[#674188]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-[#674188] text-white p-2 w-full rounded">
          Reset Password
        </button>

        <Link
          to="/login"
          className="text-sm text-blue-500 block text-right  mt-3 hover:underline"
        >
          Back to Login
        </Link>

        {message && (
          <p className="mt-2 text-center text-blue-600">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;