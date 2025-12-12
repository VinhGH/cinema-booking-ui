import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, X, Calendar as CalendarIcon, Clock } from "lucide-react"
import { moviesApi, showtimesApi } from "../../../services/api"

export default function AdminShowtimes() {
    const [showtimes, setShowtimes] = useState([])
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingShowtime, setEditingShowtime] = useState(null)
    const [formData, setFormData] = useState({
        movieId: "",
        hallId: "",
        date: "",
        time: "",
        price: ""
    })

    // Hall IDs from Supabase database (verified via SQL query)
    const halls = [
        { id: "315f05cd-684c-4f47-a1ce-6dd549e45dc5", name: "Hall 1" },
        { id: "722f9c07-7848-4ea5-8d03-a70931f132cf", name: "Hall 1" },
        { id: "4f47ec76-2de1-426e-868b-ea42ab082c28", name: "Hall 1" },
        { id: "779ddc81-bde0-4c7e-a6ae-0fee6eb2db5f", name: "Hall 2" },
        { id: "478a0b90-4c55-4802-87f3-676d9d16db3a", name: "Hall 2" },
        { id: "bd91c96e-431a-4fd3-92e1-8b789cbec8f3", name: "Hall 2" },
        { id: "74fdc146-9636-454c-b813-28187646f38a", name: "Hall 3" },
        { id: "446c4723-509e-42c5-a29d-06de96ac2c82", name: "Hall 3" }
    ]

    // Fetch showtimes and movies from API
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            console.log('📅 [Admin Showtimes] Fetching data from API...')
            setLoading(true)
            setError(null)

            const [showtimesData, moviesData] = await Promise.all([
                showtimesApi.getAll(),
                moviesApi.getNowShowing()
            ])

            console.log('✅ [Admin Showtimes] Showtimes loaded:', showtimesData.length)
            console.log('✅ [Admin Showtimes] Movies loaded:', moviesData.length)

            setShowtimes(showtimesData)
            setMovies(moviesData)
        } catch (err) {
            console.error('❌ [Admin Showtimes] Error fetching data:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const filteredShowtimes = showtimes.filter(s =>
        s.movies?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.halls?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAdd = () => {
        setEditingShowtime(null)
        setFormData({ movieId: "", hallId: "", date: "", time: "", price: "" })
        setShowModal(true)
    }

    const handleEdit = (showtime) => {
        console.log('✏️ [Admin Showtimes] Editing showtime:', showtime.id)
        setEditingShowtime(showtime)
        setFormData({
            movieId: showtime.movie_id,
            hallId: showtime.hall_id,
            date: showtime.show_date,
            time: showtime.show_time,
            price: showtime.price
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa suất chiếu này?")) {
            try {
                console.log('🗑️ [Admin Showtimes] Deleting showtime:', id)

                // Call API first - if this fails, we won't update local state
                const response = await showtimesApi.delete(id)
                console.log('✅ [Admin Showtimes] API response:', response)
                console.log('✅ [Admin Showtimes] Showtime deleted successfully')

                // Only update local state if API call succeeded
                setShowtimes(showtimes.filter(s => s.id !== id))
            } catch (err) {
                console.error('❌ [Admin Showtimes] Error deleting showtime:', err)
                console.error('❌ [Admin Showtimes] Error details:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status
                })

                // Show detailed error message
                const errorMsg = err.response?.data?.message || err.message || 'Lỗi không xác định'
                alert(`Lỗi khi xóa suất chiếu: ${errorMsg}\n\nVui lòng kiểm tra:\n- Bạn đã đăng nhập với quyền admin?\n- Backend server đang chạy?\n- Suất chiếu có booking nào chưa?`)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            console.log('💾 [Admin Showtimes] Submitting form...', editingShowtime ? 'UPDATE' : 'CREATE')
            setLoading(true)

            if (editingShowtime) {
                await showtimesApi.update(editingShowtime.id, formData)
                console.log('✅ [Admin Showtimes] Showtime updated successfully')
            } else {
                await showtimesApi.create(formData)
                console.log('✅ [Admin Showtimes] Showtime created successfully')
            }

            await fetchData()
            setShowModal(false)
        } catch (err) {
            console.error('❌ [Admin Showtimes] Error submitting form:', err)
            alert('Lỗi khi lưu suất chiếu: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="p-8 bg-[#0D0D0D] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Quản Lý Lịch Chiếu</h1>
                    <p className="text-[#B3B3B3]">Lập lịch và quản lý suất chiếu</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-[#E50914] hover:bg-[#B20710] text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#E50914]/30"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Suất Chiếu
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]" />
                    <input
                        type="text"
                        placeholder="Tìm theo phim hoặc phòng..."
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
                        <p className="mt-4 text-secondary">Đang tải danh sách suất chiếu...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-500/10 border border-red-500 rounded-xl p-6 mb-6">
                    <p className="text-red-500">Lỗi: {error}</p>
                    <button
                        onClick={fetchData}
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
                                <th className="text-left p-4 font-semibold">Phòng</th>
                                <th className="text-left p-4 font-semibold">Ngày</th>
                                <th className="text-left p-4 font-semibold">Giờ</th>
                                <th className="text-left p-4 font-semibold">Giá</th>
                                <th className="text-right p-4 font-semibold">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredShowtimes.map((showtime) => (
                                <tr key={showtime.id} className="border-b border-[#404040] hover:bg-[#2A2A2A] transition-colors">
                                    <td className="p-4 text-white font-semibold">{showtime.movies?.title || 'N/A'}</td>
                                    <td className="p-4 text-[#B3B3B3]">{showtime.halls?.name || 'N/A'}</td>
                                    <td className="p-4 text-[#B3B3B3]">{formatDate(showtime.show_date)}</td>
                                    <td className="p-4 text-white font-bold">{showtime.show_time}</td>
                                    <td className="p-4 text-[#E50914] font-bold">{formatPrice(showtime.price)}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(showtime)}
                                                className="p-2 hover:bg-[#404040] rounded-lg transition-colors text-blue-400"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(showtime.id)}
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
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl max-w-2xl w-full shadow-lg shadow-black/20">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black/40 backdrop-blur-xl z-10">
                            <h2 className="text-2xl font-bold text-white">
                                {editingShowtime ? "Chỉnh Sửa Suất Chiếu" : "Thêm Suất Chiếu Mới"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-[#808080] hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-white font-semibold mb-2">Phim *</label>
                                    <select
                                        required
                                        value={formData.movieId}
                                        onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    >
                                        <option value="">Chọn Phim</option>
                                        {movies.map(movie => (
                                            <option key={movie.id} value={movie.id}>{movie.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">Phòng *</label>
                                    <select
                                        required
                                        value={formData.hallId}
                                        onChange={(e) => setFormData({ ...formData, hallId: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    >
                                        <option value="">Chọn Phòng</option>
                                        {halls.map(hall => (
                                            <option key={hall.id} value={hall.id}>{hall.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">Giá (VND) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        Ngày *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Giờ *
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-[#E50914] hover:bg-[#B20710] text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Đang xử lý...' : (editingShowtime ? "Cập Nhật Suất Chiếu" : "Thêm Suất Chiếu")}
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
