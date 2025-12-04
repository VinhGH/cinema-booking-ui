import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import NowShowing from './pages/NowShowing'
import ComingSoon from './pages/ComingSoon'
import Showtimes from './pages/Showtimes'
import Promotions from './pages/Promotions'
import Support from './pages/Support'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import MovieDetail from './pages/MovieDetail'
import Booking from './pages/Booking'
import Payment from './pages/Payment'
import MyTickets from './pages/MyTickets'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/now-showing" element={<NowShowing />} />
                    <Route path="/coming-soon" element={<ComingSoon />} />
                    <Route path="/showtimes" element={<Showtimes />} />
                    <Route path="/promotions" element={<Promotions />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/movie/:id" element={<MovieDetail />} />
                    <Route path="/booking/:id" element={<Booking />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/tickets" element={<MyTickets />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
