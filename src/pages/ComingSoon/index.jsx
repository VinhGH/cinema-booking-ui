import { Link } from "react-router-dom"
import Header from "../../layouts/header"
import Footer from "../../layouts/footer"
import MovieCard from "../../components/cards/movie-card"
import translations from "../../utils/translations"
import { getComingSoonMovies } from "../../data/movies"

const COMING_SOON_MOVIES = getComingSoonMovies()

export default function ComingSoonPage() {
    const t = translations.home

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
                                {COMING_SOON_MOVIES.length} phim
                            </span>
                        </div>
                    </div>
                </section>

                {/* Movies Grid */}
                <section className="max-w-6xl mx-auto px-8 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {COMING_SOON_MOVIES.map((movie) => (
                            <div key={movie.id} className="group relative">
                                <Link to={`/movie/${movie.id}`}>
                                    <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 cursor-pointer">
                                        {/* Movie Poster */}
                                        <div className="aspect-[2/3] relative">
                                            <img
                                                src={movie.poster}
                                                alt={movie.title}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Age Rating Badge */}
                                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold ${movie.ageRating === 'P' ? 'bg-green-500' :
                                                    movie.ageRating === 'T13' ? 'bg-yellow-500' :
                                                        movie.ageRating === 'T16' ? 'bg-orange-500' :
                                                            'bg-red-500'
                                                } text-white`}>
                                                {movie.ageRating}
                                            </div>

                                            {/* Coming Soon Badge */}
                                            <div className="absolute top-3 left-3 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-lg text-xs font-bold text-white">
                                                Sắp Chiếu
                                            </div>

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>

                                        {/* Movie Info */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                {movie.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-sm text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    Chưa có
                                                </span>
                                                <span>{movie.genre}</span>
                                            </div>
                                            <div className="mt-2 pt-2 border-t border-white/10">
                                                <p className="text-xs text-primary font-medium">
                                                    Khởi chiếu: {movie.releaseDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Empty State if no movies */}
                {COMING_SOON_MOVIES.length === 0 && (
                    <section className="max-w-6xl mx-auto px-8 py-24 text-center">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12">
                            <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                            <h3 className="text-2xl font-bold text-white mb-2">Chưa có phim sắp chiếu</h3>
                            <p className="text-gray-400">Vui lòng quay lại sau để xem các bộ phim mới nhất</p>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    )
}
