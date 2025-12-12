import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../../layouts/header"
import Footer from "../../layouts/footer"
import { moviesApi, showtimesApi } from "../../services/api"
import { Calendar, MapPin, Phone } from "lucide-react"

export default function ShowtimesPage() {
    const [selectedDate, setSelectedDate] = useState(0)
    const [showtimes, setShowtimes] = useState([])
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Tạo danh sách 7 ngày từ hôm nay
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() + i)
        return date
    })

    // Fetch showtimes and movies from API
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            console.log('📅 [Showtimes Page] Fetching data from API...')
            setLoading(true)
            setError(null)

            const [showtimesData, moviesData] = await Promise.all([
                showtimesApi.getAll(),
                moviesApi.getNowShowing()
            ])

            console.log('✅ [Showtimes Page] Showtimes loaded:', showtimesData.length)
            console.log('✅ [Showtimes Page] Movies loaded:', moviesData.length)

            setShowtimes(showtimesData)
            setMovies(moviesData)
        } catch (err) {
            console.error('❌ [Showtimes Page] Error fetching data:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (date) => {
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
        return {
            dayName: days[date.getDay()],
            date: date.getDate().toString().padStart(2, '0'),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            year: date.getFullYear()
        }
    }

    // Get showtimes for a specific movie
    const getShowtimesForMovie = (movieId) => {
        return showtimes.filter(st => st.movie_id === movieId)
    }

    const isSpecialShowtime = (time) => {
        const hour = parseInt(time.split(':')[0])
        return hour >= 18 // Suất chiếu từ 18h trở đi là suất đặc biệt
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background pt-24">
                {/* Cinema Info Header */}
                <section className="bg-gradient-to-r from-primary/20 to-transparent border-b border-white/10">
                    <div className="max-w-6xl mx-auto px-8 py-8">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold text-white mb-2">CineBook Tam Kỳ Đà Nẵng</h1>
                            <p className="text-gray-400 text-sm">0848.272.288</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                            <MapPin className="w-4 h-4 text-primary" />
                            <p>Trung tâm giải trí CineBook, Đường Bạch Đằng, Phường Tam Kỳ, TP. Đà Nẵng</p>
                        </div>
                    </div>
                </section>

                {/* Date Selector */}
                <section className="bg-background border-b border-white/10 sticky top-20 z-10 backdrop-blur-md bg-background/95">
                    <div className="max-w-6xl mx-auto px-8 py-4">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {dates.map((date, index) => {
                                const formatted = formatDate(date)
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(index)}
                                        className={`flex-shrink-0 px-6 py-3 rounded-xl border transition-all ${selectedDate === index
                                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="text-center">
                                            <div className="text-xs font-medium">{formatted.dayName}</div>
                                            <div className="text-lg font-bold">{formatted.date}/{formatted.month}/{formatted.year}</div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            <p className="mt-4 text-secondary">Đang tải lịch chiếu...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="max-w-6xl mx-auto px-8 py-8">
                        <div className="bg-red-500/10 border border-red-500 rounded-xl p-6">
                            <p className="text-red-500">Lỗi: {error}</p>
                            <button
                                onClick={fetchData}
                                className="mt-3 text-red-400 hover:text-red-300 underline"
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                )}

                {/* Movies List */}
                {!loading && !error && (
                    <section className="max-w-6xl mx-auto px-8 py-8">
                        <div className="space-y-8">
                            {movies.map((movie) => {
                                const movieShowtimes = getShowtimesForMovie(movie.id)
                                if (movieShowtimes.length === 0) return null

                                return (
                                    <div key={movie.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-primary/30 transition-all">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            {/* Movie Poster */}
                                            <div className="md:col-span-1">
                                                <Link to={`/movie/${movie.id}`}>
                                                    <img
                                                        src={movie.poster || movie.poster_url}
                                                        alt={movie.title}
                                                        className="w-full rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer aspect-[2/3] object-cover"
                                                    />
                                                </Link>
                                            </div>

                                            {/* Movie Info & Showtimes */}
                                            <div className="md:col-span-3 space-y-4">
                                                {/* Title */}
                                                <Link to={`/movie/${movie.id}`}>
                                                    <h2 className="text-2xl font-bold text-white hover:text-primary transition-colors cursor-pointer">
                                                        {movie.title}
                                                    </h2>
                                                </Link>

                                                {/* Badges */}
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-3 py-1 bg-primary rounded-lg text-xs font-bold text-white">
                                                        2D
                                                    </span>
                                                    <span className="px-3 py-1 bg-orange-500 rounded-lg text-xs font-bold text-white">
                                                        T13
                                                    </span>
                                                </div>

                                                {/* Genre & Duration */}
                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                    <span>{movie.genre}</span>
                                                    <span>•</span>
                                                    <span>{movie.duration} phút</span>
                                                </div>

                                                {/* Director */}
                                                {movie.director && (
                                                    <div className="text-sm">
                                                        <span className="text-primary font-medium">Đạo diễn: </span>
                                                        <span className="text-gray-300">{movie.director}</span>
                                                    </div>
                                                )}

                                                {/* Cast */}
                                                {movie.cast && (
                                                    <div className="text-sm">
                                                        <span className="text-primary font-medium">Diễn viên: </span>
                                                        <span className="text-gray-300">{movie.cast}</span>
                                                    </div>
                                                )}

                                                {/* Description */}
                                                {movie.description && (
                                                    <p className="text-sm text-gray-400 line-clamp-3">
                                                        {movie.description}
                                                    </p>
                                                )}

                                                {/* Showtimes */}
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-400 mb-3">Suất chiếu:</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {movieShowtimes.map((showtime) => (
                                                            <Link
                                                                key={showtime.id}
                                                                to={`/booking/${movie.id}?showtime=${showtime.id}`}
                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSpecialShowtime(showtime.show_time)
                                                                    ? 'bg-primary hover:bg-red-600 text-white shadow-lg shadow-primary/20'
                                                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                                                    }`}
                                                            >
                                                                {showtime.show_time}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Legend */}
                <section className="max-w-6xl mx-auto px-8 py-8">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Chú thích:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-8 bg-white/10 border border-white/10 rounded-lg"></div>
                                <span className="text-gray-300">Suất chiếu thường</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-8 bg-primary rounded-lg shadow-lg shadow-primary/20"></div>
                                <span className="text-gray-300">Suất chiếu đặc biệt (từ 18h)</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
