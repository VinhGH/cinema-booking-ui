import { useState } from "react"
import { Link, useParams, Navigate } from "react-router-dom"
import { ArrowLeft, Star, Clock, Calendar, Globe, MessageSquare, Play, Info } from "lucide-react"
import Header from "../../layouts/header"
import ShowtimeSelector from "../../components/common/ShowtimeSelector"
import RelatedMoviesCarousel from "../../components/common/RelatedMoviesCarousel"
import { getMovieById, ALL_MOVIES } from "../../data/movies"

export default function MovieDetailPage() {
  const { id: movieId } = useParams()
  const [selectedShowtime, setSelectedShowtime] = useState(null)
  const [showFullDescription, setShowFullDescription] = useState(false)

  // Lấy thông tin phim theo ID
  const movie = getMovieById(movieId)

  // Nếu không tìm thấy thì quay về trang chủ
  if (!movie) {
    return <Navigate to="/" replace />
  }

  // Mock dữ liệu suất chiếu
  const showtimes = [
    { id: 1, date: "2024-12-04", time: "14:00", hall: "Phòng chiếu 1", price: 120000, availableSeats: 24 },
    { id: 2, date: "2024-12-04", time: "17:30", hall: "Phòng chiếu 2", price: 150000, availableSeats: 8 },
    { id: 3, date: "2024-12-04", time: "20:00", hall: "Phòng chiếu 1", price: 150000, availableSeats: 12 },
    { id: 4, date: "2024-12-05", time: "14:00", hall: "Phòng chiếu 3", price: 120000, availableSeats: 30 },
    { id: 5, date: "2024-12-05", time: "17:30", hall: "Phòng chiếu 2", price: 150000, availableSeats: 5 },
    { id: 6, date: "2024-12-05", time: "20:00", hall: "Phòng chiếu 1", price: 150000, availableSeats: 0 },
  ]

  // Lọc phim cùng thể loại
  const relatedMovies = ALL_MOVIES.filter(
    m => m.genre === movie.genre && m.id !== movie.id
  ).slice(0, 8)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0D0D0D]">

        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[500px]">
          <div className="absolute inset-0">
            <img src={movie.poster || "/placeholder.svg"} alt={movie.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/60 to-transparent" />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-8 flex items-end pb-12">
            <div className="max-w-3xl space-y-6">

              {/* Quay lại */}
              <Link to="/" className="inline-flex items-center gap-2 text-[#B3B3B3] hover:text-white transition-colors duration-200 mb-4">
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại danh sách phim</span>
              </Link>

              {/* Tên phim */}
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">{movie.title}</h1>

              {/* Thông tin meta */}
              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center gap-1.5 bg-[#E50914] px-3 py-1.5 rounded-lg font-bold">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{movie.rating}/10</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{movie.duration} phút</span>
                </div>

                <div className="inline-block bg-[#2A2A2A] px-3 py-1.5 rounded-lg border border-[#404040]">
                  {movie.genre}
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-4">
                <a href="#showtimes">
                  <button className="bg-[#E50914] hover:bg-[#B20710] text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#E50914]/30">
                    <Play className="w-5 h-5" />
                    Đặt vé ngay
                  </button>
                </a>

                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="bg-[#2A2A2A] hover:bg-[#333333] text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 border border-[#404040]"
                >
                  <Info className="w-5 h-5" />
                  Thông tin thêm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chi tiết phim */}
        <div className="max-w-7xl mx-auto px-8 py-12 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Mô tả */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Tóm tắt nội dung</h2>

                <p className={`text-[#B3B3B3] leading-relaxed ${!showFullDescription && 'line-clamp-3'}`}>
                  {movie.description}
                </p>

                {!showFullDescription && (
                  <button
                    onClick={() => setShowFullDescription(true)}
                    className="text-[#E50914] hover:text-[#FF1A24] font-semibold mt-2 transition-colors duration-200"
                  >
                    Xem thêm →
                  </button>
                )}
              </div>
            </div>

            {/* Thông tin phim */}
            <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6 space-y-4 h-fit">
              <h3 className="text-lg font-bold text-white mb-4">Thông tin phim</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-[#808080]">Đạo diễn</span>
                  <p className="text-white font-semibold mt-1">{movie.director}</p>
                </div>

                <div>
                  <span className="text-[#808080]">Diễn viên</span>
                  <p className="text-white font-semibold mt-1">{movie.cast}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#808080]" />
                  <div>
                    <span className="text-[#808080]">Ngôn ngữ: </span>
                    <span className="text-white font-semibold">{movie.language}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#808080]" />
                  <div>
                    <span className="text-[#808080]">Phụ đề: </span>
                    <span className="text-white font-semibold">{movie.subtitle}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#808080]">Ngày phát hành</span>
                  <p className="text-white font-semibold mt-1">
                    {new Date(movie.releaseDate).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Suất chiếu */}
          <div id="showtimes" className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-white mb-8">Chọn suất chiếu</h2>

            <ShowtimeSelector
              showtimes={showtimes}
              selectedShowtime={selectedShowtime}
              onSelect={setSelectedShowtime}
            />

            {selectedShowtime && (
              <div className="mt-8 flex justify-end animate-slide-up">
                <Link to={`/booking/${movie.id}?showtime=${selectedShowtime.id}`}>
                  <button className="bg-[#E50914] hover:bg-[#B20710] text-white font-bold py-4 px-12 rounded-lg transition-all duration-200 shadow-lg shadow-[#E50914]/30 text-lg">
                    Tiếp tục chọn ghế →
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Phim liên quan */}
          {relatedMovies.length > 0 && (
            <div className="pt-8">
              <RelatedMoviesCarousel
                movies={relatedMovies}
                currentMovieId={movie.id}
              />
            </div>
          )}
        </div>
      </main>
    </>
  )
}
