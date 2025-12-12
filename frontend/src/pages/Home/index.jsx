import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../../layouts/header"
import Footer from "../../layouts/footer"
import MovieCard from "../../components/cards/movie-card"
import HeroCarousel from "../../components/common/hero-carousel"
import translations from "../../utils/translations"
import { moviesApi } from "../../services/api"

export default function HomePage() {
  const t = translations.home
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const data = await moviesApi.getNowShowing()
        setMovies(data)
      } catch (err) {
        console.error('Error fetching movies:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Filter Section */}
        <section className="bg-background border-b border-border">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-primary/80 backdrop-blur-md border border-primary/20 text-white rounded-xl text-sm font-medium hover:bg-primary transition shadow-lg shadow-primary/20">
                {t.filterAll}
              </button>
              <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-foreground rounded-xl text-sm hover:bg-white/20 transition">
                {t.filterAction}
              </button>
              <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-foreground rounded-xl text-sm hover:bg-white/20 transition">
                {t.filterComedy}
              </button>
              <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-foreground rounded-xl text-sm hover:bg-white/20 transition">
                {t.filterSciFi}
              </button>
              <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-foreground rounded-xl text-sm hover:bg-white/20 transition">
                {t.filterDrama}
              </button>
            </div>
          </div>
        </section>

        {/* Movies Grid */}
        <section className="max-w-6xl mx-auto px-8 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-secondary">Loading movies...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error: {error}</p>
              <p className="text-secondary mt-2">Please make sure backend is running</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-secondary">No movies found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <Link key={movie.id} to={`/movie/${movie.id}`}>
                  <MovieCard movie={movie} />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        <section className="max-w-6xl mx-auto px-8 py-8 flex justify-center gap-2">
          <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/20 transition text-white">← {translations.common.previous}</button>
          <button className="px-4 py-2 bg-primary/80 backdrop-blur-md border border-primary/20 text-white rounded-xl shadow-lg shadow-primary/20">1</button>
          <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/20 transition text-white">2</button>
          <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/20 transition text-white">3</button>
          <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/20 transition text-white">{translations.common.next} →</button>
        </section>
      </main>
      <Footer />
    </>
  )
}
