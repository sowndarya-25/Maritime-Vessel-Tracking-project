import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { loginStart, loginSuccess, loginFailure } from "../stores/slices/authSlice"
import ReCAPTCHA from "react-google-recaptcha"
import api from "../api/axios"
import authService from "../services/authService"

export default function LoginPage() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isSignup, setIsSignup] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false)

  const [captchaValue, setCaptchaValue] = useState(null)

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "operator"
  })

  const [resetEmail, setResetEmail] = useState("")
  const [resetPassword, setResetPassword] = useState("")
  const [resetConfirmPassword, setResetConfirmPassword] = useState("")

  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // ================= LOGIN / SIGNUP =================
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    // ================= SIGNUP =================
    if (isSignup) {

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      try {
        // Use email as username in backend
        await api.post("auth/register/", {
          username: form.email,
          password: form.password,
          role: form.role
        })

        setMessage("Signup successful. You can now sign in.")
        setIsSignup(false)
        return

      } catch (err) {
        setError(
          err.response?.data?.detail ||
          "Signup failed. Please try again."
        )
        return
      }
    }

    // ================= CAPTCHA CHECK =================
    if (!captchaValue) {
      setError("Please verify captcha")
      return
    }

    // ================= LOGIN =================
    try {
      dispatch(loginStart())

      // Backend expects username; we use email as username
      const loginResponse = await api.post("auth/login/", {
        username: form.email,
        password: form.password
      })

      const { access, refresh } = loginResponse.data

      // Persist tokens
      localStorage.setItem("access_token", access)
      localStorage.setItem("refresh_token", refresh)

      // Fetch profile from backend
      const user = await authService.getProfile()

      dispatch(
        loginSuccess({
          user,
          token: access
        })
      )

      navigate("/dashboard")

    } catch (err) {
      dispatch(
        loginFailure(
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "Login failed"
        )
      )

      setError(
        err.response?.data?.error ||
        "Invalid email or password"
      )
    }
  }

  // ================= FORGOT PASSWORD =================
  const handleResetPassword = (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    const users = JSON.parse(localStorage.getItem("users")) || []
    const userIndex = users.findIndex(u => u.email === resetEmail)

    if (userIndex === -1) {
      setError("Email not found")
      return
    }

    if (resetPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (resetPassword !== resetConfirmPassword) {
      setError("Passwords do not match")
      return
    }

    users[userIndex].password = resetPassword
    localStorage.setItem("users", JSON.stringify(users))

    setMessage("Password reset successful ✅")
    setIsForgotPassword(false)
  }

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/ship.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Title */}
      <div className="relative z-10 text-center mb-10">
        <h1 className="glow-title">Maritime Vessel Tracking</h1>
        <p className="glow-subtitle">Analytics & Safety Platform</p>
      </div>

      {/* Card */}
      <div className="relative z-10 glass-card text-white w-96 p-6 rounded-xl">

        <h2 className="text-2xl font-bold text-center mb-4">
          {isForgotPassword ? "Reset Password" : isSignup ? "Signup" : "Login"}
        </h2>

        {!isForgotPassword ? (

          <form onSubmit={handleSubmit}>

            {isSignup && (
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={form.username}
                onChange={handleChange}
                required
                className="input"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
              required
              className="input"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                required
                className="input"
              />
              <div
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </div>
            </div>

            {isSignup && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            )}
{isSignup && (
  <select
    name="role"
    value={form.role}
    onChange={handleChange}
    className="input"
  >
    <option value="operator">Operator</option>
    <option value="admin">Admin</option>
    <option value="Viewer">Viewer</option>
  </select>
)}
            {!isSignup && (
              <>
                <div className="flex justify-center mt-3">
                  <ReCAPTCHA
                    sitekey="6LcLs24sAAAAAL-HVkAoTr6wzmxwHyR0Nmja4Ruw"
                    onChange={(value) => setCaptchaValue(value)}
                  />
                </div>

                <p
                  className="text-blue-400 text-sm mt-2 cursor-pointer text-right"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Password?
                </p>
              </>
            )}

            {error && <p className="text-red-400 mt-2">{error}</p>}
            {message && <p className="text-green-400 mt-2">{message}</p>}

            <button className="login-btn w-full mt-4">
              {isSignup ? "Signup" : "Signin"}
            </button>

            <p className="text-center mt-3">
              {isSignup ? "Already have account?" : "Don't have account?"}
              <span
                onClick={() => setIsSignup(!isSignup)}
                className="text-blue-400 cursor-pointer ml-2"
              >
                {isSignup ? "Signin" : "Signup"}
              </span>
            </p>

          </form>

        ) : (

          <form onSubmit={handleResetPassword}>

            <input
              type="email"
              placeholder="Enter Registered Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              className="input"
            />

            <input
              type="password"
              placeholder="New Password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              required
              className="input"
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={resetConfirmPassword}
              onChange={(e) => setResetConfirmPassword(e.target.value)}
              required
              className="input"
            />

            <button className="login-btn w-full mt-4">
              Reset Password
            </button>

            <p
              className="text-blue-400 text-sm mt-3 cursor-pointer text-center"
              onClick={() => setIsForgotPassword(false)}
            >
              Back to Login
            </p>

          </form>

        )}
      </div>

      {/* Wave */}
      <div className="wave"></div>

    </div>
  )
}
