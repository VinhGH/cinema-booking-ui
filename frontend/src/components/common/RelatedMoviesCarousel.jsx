import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function RelatedMoviesCarousel({ movies = [], currentMovieId }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [itemsPerView, setItemsPerView] = useState(4)

    // Filter out current movie
    const relatedMovies = movies.filter(m => m.id !== currentMovieId)

    // Responsive items per view
    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth < 640) setItemsPerView(2)
            else if (window.innerWidth < 1024) setItemsPerView(3)
            else setItemsPerView(4)
        }

        updateItemsPerView()
        window.addEventListener('resize', updateItemsPerView)
        return () => window.removeEventListener('resize', updateItemsPerView)
    }, [])

    const maxIndex = Math.max(0, relatedMovies.length - itemsPerView)

    const next = () => {
        setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
    }

    const prev = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0))
    }

    if (relatedMovies.length === 0) return null

    return (
        <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-6">More Like This</h2>

            <div className="relative group">
                {/* Navigation Arrows */}
                {currentIndex > 0 && (
                    <button
                        onClick={prev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                )}

                {currentIndex < maxIndex && (
                    <button
                        onClick={next}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                )}

                {/* Carousel Container */}
                <div className="overflow-hidden">
                    <div
                        className="flex gap-4 transition-transform duration-500 ease-out"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / itemsPerView + 1)}%)`
                        }}
                    >
                        {relatedMovies.map((movie) => (
                            <Link
                                key={movie.id}
                                to={`/movie/${movie.id}`}
                                className="flex-shrink-0 group/card"
                                style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)` }}
                            >
                                <div className="relative overflow-hidden rounded-xl bg-[#2A2A2A] aspect-[2/3] border border-[#404040] transition-all duration-300 group-hover/card:border-[#E50914] group-hover/card:shadow-lg group-hover/card:shadow-[#E50914]/20">
                                    <img
                                        src={movie.poster || "/placeholder.svg"}
                                        alt={movie.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                    />

                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="text-white font-bold text-sm line-clamp-2 mb-2">
                                                {movie.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-[#B3B3B3]">
                                                <span className="text-yellow-400">★ {movie.rating}</span>
                                                <span>•</span>
                                                <span>{movie.genre}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating Badge */}
                                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-bold">
                                        ★ {movie.rating}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Dots Indicator */}
                {maxIndex > 0 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? "w-8 bg-[#E50914]"
                                        : "w-1.5 bg-[#404040] hover:bg-[#808080]"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
