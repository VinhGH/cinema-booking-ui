import { useState } from "react"
import { Link } from "react-router-dom"
import Header from "../../layouts/header"
import Footer from "../../layouts/footer"
import { getNowShowingMovies } from "../../data/movies"
import { Calendar, MapPin, Phone } from "lucide-react"

export default function ShowtimesPage() {
    const [selectedDate, setSelectedDate] = useState(0)
    const movies = getNowShowingMovies()

    // Tạo danh sách 7 ngày từ hôm nay
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() + i)
        return date
    })

    const formatDate = (date) => {
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
        return {
            dayName: days[date.getDay()],
            date: date.getDate().toString().padStart(2, '0'),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            year: date.getFullYear()
        }
    }

    // Giờ chiếu mẫu cho mỗi phim
    const getShowtimes = (movieId) => {
        const showtimes = {
            1: ['08:50', '13:30', '15:00', '16:20', '18:00', '18:55'],
            2: ['12:55', '15:55', '17:20', '20:55'],
            3: ['08:40', '09:40', '10:35', '11:35', '12:30', '14:25', '15:25', '17:00', '18:15', '19:25', '20:10', '21:20', '22:05'],
            4: ['10:50'],
            5: ['09:10', '11:35'],
            6: ['14:00', '20:00', '21:55'],
            7: ['16:30', '19:45', '22:00']
        }
        return showtimes[movieId] || ['14:00', '17:30', '20:00']
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

                {/* Movies List */}
                <section className="max-w-6xl mx-auto px-8 py-8">
                    <div className="space-y-8">
                        {movies.map((movie) => (
                            <div key={movie.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-primary/30 transition-all">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/* Movie Poster */}
                                    <div className="md:col-span-1">
                                        <Link to={`/movie/${movie.id}`}>
                                            <img
                                                src={movie.poster}
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
                                        <div className="text-sm">
                                            <span className="text-primary font-medium">Đạo diễn: </span>
                                            <span className="text-gray-300">{movie.director}</span>
                                        </div>

                                        {/* Cast */}
                                        <div className="text-sm">
                                            <span className="text-primary font-medium">Diễn viên: </span>
                                            <span className="text-gray-300">{movie.cast}</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-gray-400 line-clamp-3">
                                            {movie.description}
                                        </p>

                                        {/* Showtimes */}
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400 mb-3">Suất chiếu:</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {getShowtimes(movie.id).map((time, index) => (
                                                    <Link
                                                        key={index}
                                                        to={`/booking/${movie.id}`}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSpecialShowtime(time)
                                                                ? 'bg-primary hover:bg-red-600 text-white shadow-lg shadow-primary/20'
                                                                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                                            }`}
                                                    >
                                                        {time}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

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
