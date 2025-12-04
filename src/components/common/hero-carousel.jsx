import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

const FEATURED_MOVIES = [
    {
        id: 1,
        title: "Phi Vụ Động Trời 2",
        subtitle: "Zootopia 2",
        description: "Judy Hopps và Nick Wilde trở lại với một cuộc phiêu lưu mới đầy kịch tính và hài hước tại thành phố Zootopia",
        releaseDate: "28.11.2024",
        backdrop: "/img/zootopia-banner.jpg",
        rating: 8.5,
    },
    {
        id: 3,
        title: "Truy Tìm Long Diên Hương",
        subtitle: "Hành Trình Phiêu Lưu",
        description: "Cuộc truy tìm bảo vật Long Diên Hương đầy gay cấn và hấp dẫn với những pha hành động nghẹt thở",
        releaseDate: "22.11.2024",
        backdrop: "/img/long-dien-huong-banner.jpg",
        rating: 7.5,
    },
    {
        id: 7,
        title: "Hoàng Tử Quỷ",
        subtitle: "Thế Giới Siêu Nhiên",
        description: "Cuộc chiến giữa thiện và ác trong thế giới siêu nhiên đầy bí ẩn và kịch tính",
        releaseDate: "05.12.2024",
        backdrop: "/img/hoang-tu-quy-banner.jpg",
        rating: 7.2,
    },
]

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [translateX, setTranslateX] = useState(0)
    const autoPlayRef = useRef(null)

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % FEATURED_MOVIES.length)
    }, [])

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + FEATURED_MOVIES.length) % FEATURED_MOVIES.length)
    }, [])

    const goToSlide = useCallback((index) => {
        setCurrentSlide(index)
    }, [])

    // Auto-play every 3 seconds
    useEffect(() => {
        autoPlayRef.current = setInterval(nextSlide, 3000)
        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current)
            }
        }
    }, [nextSlide])

    // Reset auto-play on user interaction
    const resetAutoPlay = useCallback(() => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current)
        }
        autoPlayRef.current = setInterval(nextSlide, 3000)
    }, [nextSlide])

    // Drag handlers
    const handleDragStart = (e) => {
        setIsDragging(true)
        setStartX(e.type === 'mousedown' ? e.pageX : e.touches[0].pageX)
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current)
        }
    }

    const handleDragMove = (e) => {
        if (!isDragging) return
        const currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX
        const diff = currentX - startX
        setTranslateX(diff)
    }

    const handleDragEnd = () => {
        if (!isDragging) return
        setIsDragging(false)

        if (Math.abs(translateX) > 100) {
            if (translateX > 0) {
                prevSlide()
            } else {
                nextSlide()
            }
        }

        setTranslateX(0)
        resetAutoPlay()
    }

    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-black">
            {/* Slides */}
            <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{
                    transform: `translateX(calc(-${currentSlide * 100}% + ${translateX}px))`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
            >
                {FEATURED_MOVIES.map((movie, index) => (
                    <div
                        key={movie.id}
                        className="min-w-full h-full relative"
                        style={{
                            backgroundImage: `url(${movie.backdrop})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

                        {/* Content */}
                        <div className="relative h-full max-w-7xl mx-auto px-8 flex items-center">
                            <div className="max-w-2xl">
                                <div className="inline-block px-4 py-1 bg-primary/20 border border-primary rounded-full text-primary text-sm font-medium mb-4">
                                    Dự kiến khởi chiếu: {movie.releaseDate}
                                </div>

                                <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">
                                    {movie.title}
                                </h1>

                                <p className="text-2xl md:text-3xl text-gray-300 font-medium mb-4">
                                    {movie.subtitle}
                                </p>

                                <p className="text-lg text-gray-400 mb-8 max-w-xl">
                                    {movie.description}
                                </p>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-400 text-2xl">★</span>
                                        <span className="text-white font-bold text-xl">{movie.rating}</span>
                                        <span className="text-gray-400">/10</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Link to={`/movie/${movie.id}`}>
                                        <button className="flex items-center gap-2 bg-primary hover:bg-red-600 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95">
                                            <Play className="w-5 h-5 fill-current" />
                                            Xem Chi Tiết
                                        </button>
                                    </Link>
                                    <Link to={`/booking/${movie.id}`}>
                                        <button className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full transition-all border border-white/20">
                                            Đặt Vé Ngay
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() => {
                    prevSlide()
                    resetAutoPlay()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white flex items-center justify-center transition-all z-10 border border-white/10"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={() => {
                    nextSlide()
                    resetAutoPlay()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white flex items-center justify-center transition-all z-10 border border-white/10"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {FEATURED_MOVIES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            goToSlide(index)
                            resetAutoPlay()
                        }}
                        className={`transition-all ${index === currentSlide
                            ? 'w-12 bg-primary'
                            : 'w-3 bg-white/50 hover:bg-white/70'
                            } h-3 rounded-full`}
                    />
                ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium border border-white/10">
                {currentSlide + 1} / {FEATURED_MOVIES.length}
            </div>
        </div>
    )
}
