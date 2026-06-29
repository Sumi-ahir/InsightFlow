import { useState, useEffect } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../auth.slice";
import { useAuth } from "../hook/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  const { handleLogin } = useAuth();

  const runLogin = async (e) => {
    e.preventDefault();

    dispatch(setError(null));

    if (!form.email || !form.password) {
      dispatch(setError("Email and password are required!"));
      return;
    }

    try {
      await handleLogin(form);
      navigate("/dashboard");
    } catch (err) {
      dispatch(
        setError(
          err.response?.data?.message || "Something went wrong"
        )
      );
    }
  };

  useEffect(() => {
    dispatch(setError(null));
  }, [dispatch]);

  if (!loading && user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-transparent">

      {/* CONTAINER */}
      <div className="w-full max-w-sm">

        {/* HEADER */}
        <div className="text-center mb-8 ">
          <h1 className="text-3xl sm:text-4xl  text-white/70  font-semibold ">
            Welcome back
          </h1>
          <p className="text-zinc-500 mt-2 text-sm sm:text-base">
            Continue to sign in to InsightFlow AI
          </p>
        </div>

        <form
          onSubmit={runLogin}
          className="w-full flex flex-col"
        >

          {/* GOOGLE */}
          <button
            onClick={() =>
              window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
            }
            type="button"
            className="w-70= mb-6 cursor-pointer flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/70 text-black py-3 hover:bg-white/50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
            <span className="text-sm sm:text-base font-medium">
              Continue with Google
            </span>
          </button>

          {/* OR */}
          <div className="my-5 flex items-center gap-3 text-white text-xs">
            <span className="flex-1 h-px bg-white/10"></span>
            OR
            <span className="flex-1 h-px bg-white/10"></span>
          </div>

          {/* EMAIL */}
          <input
            className="w-full bg-[#1E1D1C] border border-white/10 p-3 mb-4 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#674188]"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              dispatch(setError(null));
            }}
          />

          {/* PASSWORD */}
          <div className="relative mb-2">
            <input
              className="w-full bg-[#1E1D1C] border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#674188]"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                dispatch(setError(null));
              }}
            />

            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </span>
          </div>

          {/* ERROR */}
          {/* {error && (
            <p className="text-red-400 text-sm mb-3">{error}</p>
          )} */}

          {/* BUTTON */}
          <button
            disabled={loading}
            className={`w-full mt-4 p-3 rounded-lg flex items-center justify-center gap-2 text-white transition
              ${loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#674188] hover:bg-[#5a3870]"
              }`}
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            Sign In
          </button>

          {/* REGISTER */}
          <p className="text-sm text-center text-white/70 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[#674188] hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;