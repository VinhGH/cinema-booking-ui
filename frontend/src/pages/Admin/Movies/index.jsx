import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, X, Film as FilmIcon } from "lucide-react"
import { moviesApi } from "../../../services/api"

export default function AdminMovies() {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingMovie, setEditingMovie] = useState(null)
    const [posterPreview, setPosterPreview] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        genre: "",
        duration: "",
        rating: "",
        director: "",
        cast: "",
        description: "",
        language: "",
        subtitle: "",
        releaseDate: "",
        poster: "",
        status: "now-showing"
    })

    // Fetch movies from API
    useEffect(() => {
        fetchMovies()
    }, [])

    const fetchMovies = async () => {
        try {
            console.log('🎬 [Admin Movies] Fetching movies from API...')
            setLoading(true)
            setError(null)
            const data = await moviesApi.getAll()
            console.log('✅ [Admin Movies] Movies loaded:', data.length)
            setMovies(data)
        } catch (err) {
            console.error('❌ [Admin Movies] Error fetching movies:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const filteredMovies = movies.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genre.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAdd = () => {
        setEditingMovie(null)
        setPosterPreview(null)
        setFormData({
            title: "", genre: "", duration: "", rating: "", director: "",
            cast: "", description: "", language: "", subtitle: "",
            releaseDate: "", poster: "", status: "now-showing"
        })
        setShowModal(true)
    }

    const handleEdit = (movie) => {
        console.log('✏️ [Admin Movies] Editing movie:', movie.id)
        setEditingMovie(movie)
        const posterUrl = movie.poster || movie.poster_url || ""
        setPosterPreview(posterUrl)
        setFormData({
            title: movie.title,
            genre: movie.genre,
            duration: movie.duration,
            rating: movie.rating,
            director: movie.director || "",
            cast: movie.cast || "",
            description: movie.description || "",
            language: movie.language || "",
            subtitle: movie.subtitle || "",
            releaseDate: movie.releaseDate || movie.release_date || "",
            poster: posterUrl,
            status: movie.status === 'now_showing' ? 'now-showing' : movie.status
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa phim này?")) {
            try {
                console.log('🗑️ [Admin Movies] Deleting movie:', id)

                // Call API first - if this fails, we won't update local state
                const response = await moviesApi.delete(id)
                console.log('✅ [Admin Movies] API response:', response)
                console.log('✅ [Admin Movies] Movie deleted successfully')

                // Only update local state if API call succeeded
                setMovies(movies.filter(m => m.id !== id))
            } catch (err) {
                console.error('❌ [Admin Movies] Error deleting movie:', err)
                console.error('❌ [Admin Movies] Error details:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status
                })

                // Show detailed error message
                const errorMsg = err.response?.data?.message || err.message || 'Lỗi không xác định'
                alert(`Lỗi khi xóa phim: ${errorMsg}\n\nVui lòng kiểm tra:\n- Bạn đã đăng nhập với quyền admin?\n- Backend server đang chạy?\n- Phim có suất chiếu hoặc booking nào chưa?`)
            }
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file ảnh!')
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Kích thước ảnh không được vượt quá 5MB!')
                return
            }

            // Convert to base64 for preview and storage
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result
                setPosterPreview(base64String)
                setFormData({ ...formData, poster: base64String })
                console.log('📸 [Admin Movies] Image uploaded and converted to base64')
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            console.log('💾 [Admin Movies] Submitting form...', editingMovie ? 'UPDATE' : 'CREATE')
            setLoading(true)

            if (editingMovie) {
                await moviesApi.update(editingMovie.id, formData)
                console.log('✅ [Admin Movies] Movie updated successfully')
            } else {
                await moviesApi.create(formData)
                console.log('✅ [Admin Movies] Movie created successfully')
            }

            await fetchMovies()
            setShowModal(false)
            setPosterPreview(null)
        } catch (err) {
            console.error('❌ [Admin Movies] Error submitting form:', err)
            alert('Lỗi khi lưu phim: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 bg-[#0D0D0D] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Quản Lý Phim</h1>
                    <p className="text-[#B3B3B3]">Quản lý danh mục phim của rạp</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-[#E50914] hover:bg-[#B20710] text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#E50914]/30"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Phim
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm phim..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg pl-12 pr-4 py-3 text-white placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        <p className="mt-4 text-secondary">Đang tải danh sách phim...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-500/10 border border-red-500 rounded-xl p-6 mb-6">
                    <p className="text-red-500">Lỗi: {error}</p>
                    <button
                        onClick={fetchMovies}
                        className="mt-3 text-red-400 hover:text-red-300 underline"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {/* Table */}
            {!loading && !error && (
                <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-[#2A2A2A] border-b border-[#404040]">
                            <tr className="text-[#B3B3B3] text-sm">
                                <th className="text-left p-4 font-semibold">Phim</th>
                                <th className="text-left p-4 font-semibold">Thể Loại</th>
                                <th className="text-left p-4 font-semibold">Thời Lượng</th>
                                <th className="text-left p-4 font-semibold">Đánh Giá</th>
                                <th className="text-left p-4 font-semibold">Trạng Thái</th>
                                <th className="text-right p-4 font-semibold">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMovies.map((movie) => (
                                <tr key={movie.id} className="border-b border-[#404040] hover:bg-[#2A2A2A] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={movie.poster} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                                            <span className="text-white font-semibold">{movie.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-[#B3B3B3]">{movie.genre}</td>
                                    <td className="p-4 text-[#B3B3B3]">{movie.duration} phút</td>
                                    <td className="p-4 text-white font-bold">{movie.rating}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${movie.status === "now-showing" || movie.status === "now_showing"
                                            ? "bg-green-500/10 text-green-400"
                                            : "bg-yellow-500/10 text-yellow-400"
                                            }`}>
                                            {movie.status === "now-showing" || movie.status === "now_showing" ? "ĐANG CHIẾU" : "SẮP CHIẾU"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(movie)}
                                                className="p-2 hover:bg-[#404040] rounded-lg transition-colors text-blue-400"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(movie.id)}
                                                className="p-2 hover:bg-[#404040] rounded-lg transition-colors text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg shadow-black/20">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black/40 backdrop-blur-xl z-10">
                            <h2 className="text-2xl font-bold text-white">
                                {editingMovie ? "Chỉnh Sửa Phim" : "Thêm Phim Mới"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-[#808080] hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-white font-semibold mb-2">Tên Phim *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">Thể Loại *</label>
                                    <select
                                        required
                                        value={formData.genre}
                                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    >
                                        <option value="">Chọn Thể Loại</option>
                                        {["Hành Động", "Hài", "Khoa Học Viễn Tưởng", "Chính Kịch", "Kinh Dị", "Lãng Mạn", "Giật Gân", "Hoạt Hình"].map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">Thời Lượng (phút) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">Đánh Giá *</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="9.9"
                                        required
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-white font-semibold mb-2">Ảnh Poster *</label>

                                    {/* Image Preview */}
                                    {posterPreview && (
                                        <div className="mb-3">
                                            <img
                                                src={posterPreview}
                                                alt="Preview"
                                                className="w-32 h-48 object-cover rounded-lg border-2 border-[#404040]"
                                            />
                                        </div>
                                    )}

                                    {/* File Upload */}
                                    <div className="mb-3">
                                        <label className="block w-full">
                                            <div className="flex items-center gap-2 bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 cursor-pointer hover:bg-[#333333] transition-colors">
                                                <FilmIcon className="w-5 h-5 text-[#E50914]" />
                                                <span className="text-white">Chọn ảnh từ máy tính</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="text-xs text-[#808080] mt-1">Hoặc nhập URL bên dưới (Max 5MB)</p>
                                    </div>

                                    {/* URL Input */}
                                    <input
                                        type="text"
                                        placeholder="https://example.com/poster.jpg"
                                        value={formData.poster.startsWith('data:') ? '' : formData.poster}
                                        onChange={(e) => {
                                            setFormData({ ...formData, poster: e.target.value })
                                            setPosterPreview(e.target.value)
                                        }}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-white font-semibold mb-2">Ngày Phát Hành *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.releaseDate}
                                        onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-white font-semibold mb-2">Tóm Tắt Nội Dung</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Nhập tóm tắt nội dung phim..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-[#E50914] resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">Trạng Thái *</label>
                                    <select
                                        required
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    >
                                        <option value="now-showing">Đang Chiếu</option>
                                        <option value="coming-soon">Sắp Chiếu</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-[#E50914] hover:bg-[#B20710] text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Đang xử lý...' : (editingMovie ? "Cập Nhật Phim" : "Thêm Phim")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 bg-[#2A2A2A] hover:bg-[#333333] text-white font-bold py-3 rounded-lg transition-colors border border-[#404040]"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
