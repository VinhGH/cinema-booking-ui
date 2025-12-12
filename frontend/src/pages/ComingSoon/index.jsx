import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../../layouts/header"
import Footer from "../../layouts/footer"
import MovieCard from "../../components/cards/movie-card"
import translations from "../../utils/translations"
import { moviesApi } from "../../services/api"

export default function ComingSoonPage() {
    const t = translations.home
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true)
                const data = await moviesApi.getComingSoon()
                setMovies(data)
            } catch (err) {
                console.error('Error fetching coming soon movies:', err)
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
            <main className="min-h-screen bg-background pt-24">
                {/* Page Header */}
                <section className="relative bg-gradient-to-r from-primary/20 to-transparent p-8 md:p-16 border-b border-white/10">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">Phim Sắp Chiếu</h1>
                        <p className="text-secondary text-lg mb-4">
                            Khám phá những bộ phim bom tấn sắp ra mắt
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary font-medium">
                                {loading ? '...' : `${movies.length} phim`}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Movies Grid */}
                <section className="max-w-6xl mx-auto px-8 py-12">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            <p className="mt-4 text-secondary">Loading coming soon movies...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500">Error: {error}</p>
                        </div>
                    ) : movies.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center">
                            <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                            <h3 className="text-2xl font-bold text-white mb-2">Chưa có phim sắp chiếu</h3>
                            <p className="text-gray-400">Vui lòng quay lại sau để xem các bộ phim mới nhất</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {movies.map((movie) => (
                                <div key={movie.id} className="group relative">
                                    <Link to={`/movie/${movie.id}`}>
                                        <MovieCard movie={movie} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    )
}
