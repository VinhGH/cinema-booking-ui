import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Menu, X, Film, Calendar, Gift, HeadphonesIcon, Mail, User, LogIn, LogOut, Ticket, Play } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import translations from "../utils/translations"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user, logout, isAdmin } = useAuth()
  const t = translations.nav

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  return (
    <>
      {/* Spacer to prevent content overlap since header is fixed */}
      <div className="h-24 md:h-32" aria-hidden="true" />

      <header
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-300 ${scrolled ? "top-4" : "top-6"
          }`}
      >
        <div className="relative">
          {/* Liquid Glass Background */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-lg shadow-black/20" />

          {/* Content */}
          <div className="relative px-6 py-3 md:px-8 md:py-4 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                CB
              </div>
              <span className="hidden sm:block text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                CineBook
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive("/")
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Film className="w-4 h-4" />
                {t.home}
              </Link>
              {/* Phim Dropdown */}
              <div className="relative group">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive("/movies") || isActive("/now-showing") || isActive("/coming-soon")
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <Film className="w-4 h-4" />
                  {t.movies}
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                    <Link
                      to="/now-showing"
                      className="flex items-center gap-3 px-6 py-3 hover:bg-primary/20 text-gray-200 hover:text-white transition-colors border-b border-white/5"
                    >
                      <Play className="w-5 h-5" />
                      <span className="font-medium">Phim Đang Chiếu</span>
                    </Link>
                    <Link
                      to="/coming-soon"
                      className="flex items-center gap-3 px-6 py-3 hover:bg-primary/20 text-gray-200 hover:text-white transition-colors"
                    >
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">Phim Sắp Chiếu</span>
                    </Link>
                  </div>
                </div>
              </div>
              <Link
                to="/showtimes"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive("/showtimes")
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Calendar className="w-4 h-4" />
                {t.showtimes}
              </Link>
              <Link
                to="/promotions"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive("/promotions")
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Gift className="w-4 h-4" />
                {t.promotions}
              </Link>
              <Link
                to="/support"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive("/support")
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                <HeadphonesIcon className="w-4 h-4" />
                {t.support}
              </Link>
              <Link
                to="/contact"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive("/contact")
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Mail className="w-4 h-4" />
                {t.contact}
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden md:block text-white text-sm font-medium">{user.name}</span>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/tickets"
                          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Ticket className="w-5 h-5" />
                          {t.myTickets}
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-5 h-5" />
                          {t.profile}
                        </Link>
                        {isAdmin() && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 text-primary hover:text-white transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {t.admin}
                          </Link>
                        )}
                      </div>
                      <div className="p-2 border-t border-white/10">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-colors w-full"
                        >
                          <LogOut className="w-5 h-5" />
                          {t.logout}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="hidden md:flex items-center gap-2 text-gray-300 hover:text-white font-medium text-sm transition-colors">
                    <LogIn className="w-4 h-4" />
                    {t.login}
                  </Link>
                  <Link to="/register">
                    <button className="bg-white text-black hover:bg-gray-100 font-bold px-5 py-2.5 rounded-full text-sm transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-105 active:scale-95">
                      {t.register}
                    </button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-4 p-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-200 lg:hidden">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                <Film className="w-5 h-5" />
                {t.home}
              </Link>
              <Link to="/movies" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                <Film className="w-5 h-5" />
                {t.movies}
              </Link>
              <Link to="/showtimes" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                <Calendar className="w-5 h-5" />
                {t.showtimes}
              </Link>
              <Link to="/promotions" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                <Gift className="w-5 h-5" />
                {t.promotions}
              </Link>
              <Link to="/support" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                <HeadphonesIcon className="w-5 h-5" />
                {t.support}
              </Link>
              <Link to="/contact" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                <Mail className="w-5 h-5" />
                {t.contact}
              </Link>
              {!user && (
                <>
                  <div className="h-px bg-white/10 my-2" />
                  <Link to="/login" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <LogIn className="w-5 h-5" />
                    {t.login}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
