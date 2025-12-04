
import { useState } from "react"
import { Link, useParams, Navigate } from "react-router-dom"
import Header from "../../layouts/header"
import ShowtimeCard from "../../components/cards/showtime-card"
import { getMovieById } from "../../data/movies"

export default function MovieDetailPage() {
  const { id: movieId } = useParams()
  const [selectedShowtime, setSelectedShowtime] = useState(null)

  // Lấy thông tin phim từ ID
  const movie = getMovieById(movieId)

  // Nếu không tìm thấy phim, redirect về trang chủ
  if (!movie) {
    return <Navigate to="/" replace />
  }

  const showtimes = [
    {
      id: 1,
      date: "2024-12-04",
      time: "14:00",
      hall: "Hall 1",
      price: 120000,
      availableSeats: 24,
    },
    {
      id: 2,
      date: "2024-12-04",
      time: "17:30",
      hall: "Hall 2",
      price: 150000,
      availableSeats: 8,
    },
    {
      id: 3,
      date: "2024-12-04",
      time: "20:00",
      hall: "Hall 1",
      price: 150000,
      availableSeats: 12,
    },
    {
      id: 4,
      date: "2024-12-05",
      time: "14:00",
      hall: "Hall 3",
      price: 120000,
      availableSeats: 30,
    },
    {
      id: 5,
      date: "2024-12-05",
      time: "17:30",
      hall: "Hall 2",
      price: 150000,
      availableSeats: 5,
    },
    {
      id: 6,
      date: "2024-12-05",
      time: "20:00",
      hall: "Hall 1",
      price: 150000,
      availableSeats: 28,
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-8">
          {/* Back Button */}
          <Link to="/" className="text-primary hover:text-red-600 mb-6 inline-block">
            ← Back to Movies
          </Link>

          {/* Movie Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="col-span-1">
              <img
                src={movie.poster || "/placeholder.svg"}
                alt={movie.title}
                className="w-full rounded-lg shadow-lg object-cover aspect-[2/3]"
              />
              <Link to={`/booking/${movie.id}`}>
                <button className="w-full mt-4 bg-primary hover:bg-red-600 text-background font-bold py-3 rounded-lg transition">
                  Book Now
                </button>
              </Link>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>

              <div className="flex flex-wrap gap-4 mb-6 text-secondary">
                <span>⭐ {movie.rating}/10</span>
                <span>⏱ {movie.duration} min</span>
                <span>🎬 {movie.genre}</span>
              </div>

              <div className="space-y-3 mb-6 text-secondary">
                <p>
                  <span className="font-bold text-foreground">Director:</span> {movie.director}
                </p>
                <p>
                  <span className="font-bold text-foreground">Cast:</span> {movie.cast}
                </p>
                <p>
                  <span className="font-bold text-foreground">Language:</span> {movie.language}
                </p>
                <p>
                  <span className="font-bold text-foreground">Subtitles:</span> {movie.subtitle}
                </p>
              </div>

              <div className="bg-secondary/10 border border-border p-4 rounded-lg">
                <p className="text-foreground leading-relaxed">{movie.description}</p>
              </div>
            </div>
          </div>

          {/* Showtimes */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Select Showtime</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {showtimes.map((showtime) => (
                <ShowtimeCard
                  key={showtime.id}
                  showtime={showtime}
                  isSelected={selectedShowtime?.id === showtime.id}
                  onSelect={() => setSelectedShowtime(showtime)}
                />
              ))}
            </div>

            {selectedShowtime && (
              <div className="mt-8 flex justify-end">
                <Link to={`/booking/${movie.id}?showtime=${selectedShowtime.id}`}>
                  <button className="bg-primary hover:bg-red-600 text-background font-bold py-3 px-8 rounded-lg transition">
                    Continue to Booking →
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
