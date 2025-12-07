import { useState } from "react"
import { Link } from "react-router-dom"
import { Ticket, Film, Calendar, Filter, Search } from "lucide-react"
import Header from "../../layouts/header"
import TicketCard from "../../components/cards/ticket-card"

export default function TicketsPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock tickets data
  const [tickets, setTickets] = useState([
    {
      id: "TKT001",
      movieTitle: "Dune: Part Two",
      date: "2024-12-10",
      time: "20:00",
      hall: "Hall 1",
      seats: ["A10", "A11"],
      status: "confirmed",
      bookingDate: "2024-11-20",
    },
    {
      id: "TKT002",
      movieTitle: "The Dark Knight",
      date: "2024-12-05",
      time: "17:30",
      hall: "Hall 2",
      seats: ["C5", "C6", "C7"],
      status: "confirmed",
      bookingDate: "2024-11-19",
    },
    {
      id: "TKT003",
      movieTitle: "Inception",
      date: "2024-11-25",
      time: "19:00",
      hall: "Hall 3",
      seats: ["B8"],
      status: "cancelled",
      bookingDate: "2024-11-15",
    },
    {
      id: "TKT004",
      movieTitle: "Interstellar",
      date: "2024-11-20",
      time: "21:00",
      hall: "Hall 1",
      seats: ["D5", "D6"],
      status: "confirmed",
      bookingDate: "2024-11-10",
    },
  ])

  const handleCancelTicket = (ticketId) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: "cancelled" } : ticket
      )
    )
  }

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "upcoming" && new Date(ticket.date) > new Date() && ticket.status === "confirmed") ||
      (activeFilter === "past" && new Date(ticket.date) <= new Date()) ||
      (activeFilter === "cancelled" && ticket.status === "cancelled")

    const matchesSearch =
      searchQuery === "" ||
      ticket.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const filters = [
    { id: "all", label: "Tất Cả Vé", count: tickets.length },
    { id: "upcoming", label: "Sắp Tới", count: tickets.filter(t => new Date(t.date) > new Date() && t.status === "confirmed").length },
    { id: "past", label: "Đã Qua", count: tickets.filter(t => new Date(t.date) <= new Date()).length },
    { id: "cancelled", label: "Đã Hủy", count: tickets.filter(t => t.status === "cancelled").length },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0D0D0D] py-8">
        <div className="max-w-6xl mx-auto px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-[#E50914] rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">Vé Của Tôi</h1>
            </div>
            <p className="text-[#B3B3B3]">
              Xem và quản lý vé xem phim của bạn
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6 mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]" />
                <input
                  type="text"
                  placeholder="Tìm theo tên phim hoặc mã đặt vé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-[#404040] rounded-lg pl-12 pr-4 py-3 text-white placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-5 h-5 text-[#808080]" />
              <span className="text-sm font-semibold text-white">Lọc:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeFilter === filter.id
                    ? "bg-[#E50914] text-white shadow-lg shadow-[#E50914]/30"
                    : "bg-[#2A2A2A] text-[#B3B3B3] hover:bg-[#333333] hover:text-white border border-[#404040]"
                    }`}
                >
                  {filter.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeFilter === filter.id
                    ? "bg-white/20"
                    : "bg-[#404040]"
                    }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tickets List */}
          {filteredTickets.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block bg-[#1A1A1A] border border-[#404040] rounded-xl p-12">
                <Film className="w-16 h-16 text-[#808080] mx-auto mb-4" />
                <h3 className="text-white text-xl font-bold mb-2">
                  {searchQuery ? "Không tìm thấy vé" : "Chưa có vé nào"}
                </h3>
                <p className="text-[#B3B3B3] mb-6">
                  {searchQuery
                    ? "Thử điều chỉnh tìm kiếm hoặc bộ lọc"
                    : "Bắt đầu đặt vé phim yêu thích ngay!"
                  }
                </p>
                {!searchQuery && (
                  <Link to="/">
                    <button className="bg-[#E50914] hover:bg-[#B20710] text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-[#E50914]/30">
                      Duyệt Phim →
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onCancel={() => handleCancelTicket(ticket.id)}
                />
              ))}
            </div>
          )}

          {/* Stats Footer */}
          {tickets.length > 0 && (
            <div className="mt-8 bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{tickets.length}</p>
                  <p className="text-sm text-[#808080]">Tổng Số Đặt Vé</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {tickets.filter(t => new Date(t.date) > new Date() && t.status === "confirmed").length}
                  </p>
                  <p className="text-sm text-[#808080]">Sắp Tới</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#B3B3B3]">
                    {tickets.filter(t => new Date(t.date) <= new Date()).length}
                  </p>
                  <p className="text-sm text-[#808080]">Đã Qua</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">
                    {tickets.filter(t => t.status === "cancelled").length}
                  </p>
                  <p className="text-sm text-[#808080]">Đã Hủy</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
