import { useState, useEffect } from 'react'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../service/auth.api'
import { clearUser } from '../auth.slice'
import { useDispatch } from 'react-redux'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    localStorage.removeItem('token')
    dispatch(clearUser())
  }, [dispatch])

  const [form, setForm] = useState({
    email: '',
    username: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Email is invalid'

    if (!form.username) newErrors.username = 'Username is required'
    else if (form.username.length < 2)
      newErrors.username = 'Username must be at least 2 characters'

    if (!form.password) newErrors.password = 'Password is required'
    else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(form.password))
      newErrors.password =
        'Password must include uppercase letter and special character'

    return newErrors
  }

  const inputBase =
    "w-full text-white text-sm bg-[#1E1D1C] border rounded-lg px-4 py-3 sm:py-2.5 transition focus:ring-2 focus:outline-none"

  const getInputClass = (field) =>
    `${inputBase} ${errors[field]
      ? 'border-red-400 focus:ring-red-300'
      : 'border-white/10 focus:ring-[#e5e0e9b8] focus:border-[#bdb8c1]'
    }`

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await register(form)

      setSuccessMsg(
        'Account created successfully! Please verify your email.'
      )
      setTimeout(() => {
        navigate('/login')
      }, 2500)
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.error?.[0]?.msg ||
          error.response?.data?.message ||
          'Registration failed'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4 sm:px-6 py-10">

      {/* CONTAINER */}
      <div className="w-full max-w-md sm:max-w-lg p-6 sm:p-8">

        {/* HEADER */}
        <div className="mb-8 text-center">

          <h1 className=" text-2xl md:text-4xl font-bold text-white/70">
            Register InsightFlow
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/30">
            Register with your details to get started
          </p>

        </div>

        {/* google */}
        <div>
          {/* GOOGLE */}
          <button
            onClick={() =>
              window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
            }
            type="button"
            className="w-full mb-6 cursor-pointer flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/70 text-black py-3 hover:bg-white/50 transition"
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
        </div>

        {/* SUCCESS */}
        {successMsg && (
          <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-center">
            <p className="text-green-400 text-sm">{successMsg}</p>
            <p className="text-white/50 text-xs mt-1">
              Redirecting to login...
            </p>
          </div>
        )}

        {/* ERROR */}
        {errors.general && (
          <div className="mb-4 p-3 text-center text-sm text-red-400">
            {errors.general}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

        {/* USERNAME */}
          <div>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className={getInputClass('username')}
              placeholder="Your name"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-400">
                {errors.username}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={getInputClass('email')}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              className={getInputClass('password')}
              placeholder="Enter a strong password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer right-3 top-3 sm:top-2.5 text-gray-500"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

            {errors.password && (
              <p className="mt-1 text-xs text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#674188] px-5 py-3 sm:py-2.5 font-semibold hover:bg-[#5a3870] disabled:opacity-50 flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="mt-6 text-center text-xs sm:text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#674188] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register