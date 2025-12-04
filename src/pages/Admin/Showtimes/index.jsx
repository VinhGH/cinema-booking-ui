import { useState } from "react"
import { Plus, Search, Edit, Trash2, X, Calendar as CalendarIcon, Clock } from "lucide-react"
import { ALL_MOVIES } from "../../../data/movies"

export default function AdminShowtimes() {
    const [showtimes, setShowtimes] = useState([
        { id: 1, movieId: 1, movieTitle: "Dune: Part Two", hall: "Phòng 1", date: "2024-12-10", time: "14:00", price: 150000, seats: 100 },
        { id: 2, movieId: 1, movieTitle: "Dune: Part Two", hall: "Phòng 2", date: "2024-12-10", time: "17:30", price: 150000, seats: 80 },
        { id: 3, movieId: 2, movieTitle: "The Dark Knight", hall: "Phòng 1", date: "2024-12-11", time: "20:00", price: 150000, seats: 100 },
        { id: 4, movieId: 3, movieTitle: "Inception", hall: "Phòng 3", date: "2024-12-12", time: "19:00", price: 120000, seats: 60 },
    ])

    const [searchQuery, setSearchQuery] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingShowtime, setEditingShowtime] = useState(null)
    const [formData, setFormData] = useState({
        movieId: "",
        hall: "",
        date: "",
        time: "",
        price: "",
        seats: ""
    })

    const halls = ["Phòng 1", "Phòng 2", "Phòng 3", "Phòng 4"]

    const filteredShowtimes = showtimes.filter(s =>
        s.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.hall.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAdd = () => {
        setEditingShowtime(null)
        setFormData({ movieId: "", hall: "", date: "", time: "", price: "", seats: "" })
        setShowModal(true)
    }

    const handleEdit = (showtime) => {
        setEditingShowtime(showtime)
        setFormData({
            movieId: showtime.movieId,
            hall: showtime.hall,
            date: showtime.date,
            time: showtime.time,
            price: showtime.price,
            seats: showtime.seats
        })
        setShowModal(true)
    }

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa suất chiếu này?")) {
            setShowtimes(showtimes.filter(s => s.id !== id))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const movie = ALL_MOVIES.find(m => m.id === parseInt(formData.movieId))

        if (editingShowtime) {
            setShowtimes(showtimes.map(s =>
                s.id === editingShowtime.id
                    ? { ...formData, id: s.id, movieTitle: movie.title, movieId: parseInt(formData.movieId) }
                    : s
            ))
        } else {
            setShowtimes([...showtimes, {
                ...formData,
                id: Date.now(),
                movieTitle: movie.title,
                movieId: parseInt(formData.movieId)
            }])
        }
        setShowModal(false)
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

            {/* Table */}
            <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#2A2A2A] border-b border-[#404040]">
                        <tr className="text-[#B3B3B3] text-sm">
                            <th className="text-left p-4 font-semibold">Phim</th>
                            <th className="text-left p-4 font-semibold">Phòng</th>
                            <th className="text-left p-4 font-semibold">Ngày</th>
                            <th className="text-left p-4 font-semibold">Giờ</th>
                            <th className="text-left p-4 font-semibold">Giá</th>
                            <th className="text-left p-4 font-semibold">Ghế</th>
                            <th className="text-right p-4 font-semibold">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredShowtimes.map((showtime) => (
                            <tr key={showtime.id} className="border-b border-[#404040] hover:bg-[#2A2A2A] transition-colors">
                                <td className="p-4 text-white font-semibold">{showtime.movieTitle}</td>
                                <td className="p-4 text-[#B3B3B3]">{showtime.hall}</td>
                                <td className="p-4 text-[#B3B3B3]">{formatDate(showtime.date)}</td>
                                <td className="p-4 text-white font-bold">{showtime.time}</td>
                                <td className="p-4 text-[#E50914] font-bold">{formatPrice(showtime.price)}</td>
                                <td className="p-4 text-[#B3B3B3]">{showtime.seats}</td>
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
                                        {ALL_MOVIES.filter(m => m.status === "now-showing").map(movie => (
                                            <option key={movie.id} value={movie.id}>{movie.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">Phòng *</label>
                                    <select
                                        required
                                        value={formData.hall}
                                        onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    >
                                        <option value="">Chọn Phòng</option>
                                        {halls.map(hall => (
                                            <option key={hall} value={hall}>{hall}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">Số Ghế *</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.seats}
                                        onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
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

                                <div className="col-span-2">
                                    <label className="block text-white font-semibold mb-2">Giá (VND) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#E50914] hover:bg-[#B20710] text-white font-bold py-3 rounded-lg transition-colors"
                                >
                                    {editingShowtime ? "Cập Nhật Suất Chiếu" : "Thêm Suất Chiếu"}
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
