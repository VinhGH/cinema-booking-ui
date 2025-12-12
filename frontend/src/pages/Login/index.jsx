import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Header from '../../layouts/header'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get success message from registration
  const successMessage = location.state?.message

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validate Gmail only
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      setError('Email phải có định dạng @gmail.com')
      setLoading(false)
      return
    }

    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } else {
      setError(result.error || 'Đăng nhập thất bại')
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center px-8 pt-24 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">CineBook</h1>
            <p className="text-gray-400">Đặt vé xem phim online</p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Đăng Nhập</h2>

            {successMessage && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-xl mb-4">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  placeholder="email@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Mật Khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-300 text-sm">Ghi Nhớ Đăng Nhập</span>
                </label>
                <Link to="/forgot-password" className="text-primary hover:text-red-600 text-sm transition-colors">
                  Quên Mật Khẩu?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </button>

              <p className="text-center text-gray-300">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-primary hover:text-red-600 font-medium transition-colors">
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
