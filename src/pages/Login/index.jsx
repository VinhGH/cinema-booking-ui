import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import translations from "../../utils/translations"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const t = translations.login

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!email || !password) {
      setError("Vui lòng điền đầy đủ thông tin")
      setLoading(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(translations.validation.invalidEmail)
      setLoading(false)
      return
    }

    const result = login(email, password)
    setLoading(false)

    if (result.success) {
      // Redirect based on role
      if (result.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } else {
      setError(result.error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">CineBook</h1>
          <p className="text-secondary">{t.subtitle}</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-lg shadow-black/20">
          <h2 className="text-2xl font-bold mb-6">{t.title}</h2>

          {error && (
            <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-secondary">{t.rememberMe}</span>
              </label>
              <a href="#" className="text-primary hover:text-red-600">
                {t.forgotPassword}
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-red-600 text-background font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? translations.common.loading : t.loginButton}
            </button>
          </form>

          <p className="text-center text-secondary mt-6">
            {t.noAccount}{" "}
            <Link to="/register" className="text-primary hover:text-red-600">
              {t.signUp}
            </Link>
          </p>

          <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-gray-300">
            <p className="font-bold mb-2">Tài khoản demo:</p>
            <p>Admin: admin@cinebook.vn / admin123</p>
            <p>User: user@cinebook.vn / user123</p>
          </div>
        </div>
      </div>
    </main>
  )
}
