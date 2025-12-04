import { useState } from "react"
import { Download, TrendingUp, DollarSign, Ticket, Film, Calendar } from "lucide-react"

export default function AdminReports() {
    const [dateRange, setDateRange] = useState("6months")

    const revenueData = {
        total: 125500000,
        avgTicketPrice: 150000,
        totalTickets: 2847,
        topMovie: "Dune: Part Two"
    }

    const monthlyRevenue = [
        { month: "Jul", revenue: 18500000 },
        { month: "Aug", revenue: 22000000 },
        { month: "Sep", revenue: 19500000 },
        { month: "Oct", revenue: 24000000 },
        { month: "Nov", revenue: 21000000 },
        { month: "Dec", revenue: 20500000 },
    ]

    const topMovies = [
        { title: "Dune: Part Two", tickets: 847, revenue: 127050000 },
        { title: "The Dark Knight", tickets: 623, revenue: 93450000 },
        { title: "Inception", tickets: 512, revenue: 76800000 },
        { title: "Interstellar", tickets: 445, revenue: 66750000 },
        { title: "The Matrix", tickets: 420, revenue: 63000000 },
    ]

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
    }

    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue))

    const handleExport = () => {
        alert("Export functionality would download CSV/PDF report here")
    }

    return (
        <div className="p-8 bg-[#0D0D0D] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Revenue Reports</h1>
                    <p className="text-[#B3B3B3]">Financial analytics and insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                    >
                        <option value="1month">Last Month</option>
                        <option value="3months">Last 3 Months</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="1year">Last Year</option>
                    </select>
                    <button
                        onClick={handleExport}
                        className="bg-[#E50914] hover:bg-[#B20710] text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#E50914]/30"
                    >
                        <Download className="w-5 h-5" />
                        Xuất Báo Cáo
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-400" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-[#808080] text-sm mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">{formatPrice(revenueData.total)}</p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                    <p className="text-[#808080] text-sm mb-1">Tickets Sold</p>
                    <p className="text-3xl font-bold text-white">{revenueData.totalTickets.toLocaleString()}</p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                    <p className="text-[#808080] text-sm mb-1">Avg Ticket Price</p>
                    <p className="text-3xl font-bold text-white">{formatPrice(revenueData.avgTicketPrice)}</p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-[#E50914]/10 rounded-lg flex items-center justify-center">
                            <Film className="w-6 h-6 text-[#E50914]" />
                        </div>
                    </div>
                    <p className="text-[#808080] text-sm mb-1">Top Movie</p>
                    <p className="text-xl font-bold text-white">{revenueData.topMovie}</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Monthly Revenue Chart */}
                <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Monthly Revenue</h3>
                            <p className="text-sm text-[#808080]">Last 6 months performance</p>
                        </div>
                        <Calendar className="w-6 h-6 text-[#E50914]" />
                    </div>

                    <div className="h-80 flex items-end justify-between gap-4">
                        {monthlyRevenue.map((data, i) => {
                            const heightPercent = (data.revenue / maxRevenue) * 100
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                    <div className="relative w-full group">
                                        <div
                                            className="w-full bg-gradient-to-t from-[#E50914] to-[#E50914]/50 rounded-t-lg transition-all duration-300 hover:from-[#E50914] hover:to-[#E50914] cursor-pointer"
                                            style={{ height: `${heightPercent * 2.5}px` }}
                                        />
                                        {/* Tooltip */}
                                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                            {formatPrice(data.revenue)}
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-[#B3B3B3]">{data.month}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Revenue Distribution */}
                <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Distribution</h3>
                            <p className="text-sm text-[#808080]">By category</p>
                        </div>
                        <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: "Tickets", value: 85, color: "bg-[#E50914]" },
                            { label: "Concessions", value: 10, color: "bg-blue-500" },
                            { label: "Others", value: 5, color: "bg-purple-500" },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[#B3B3B3]">{item.label}</span>
                                    <span className="text-sm font-bold text-white">{item.value}%</span>
                                </div>
                                <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} transition-all duration-500`}
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Movies Table */}
            <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl overflow-hidden">
                <div className="p-6 border-b border-[#404040]">
                    <h3 className="text-xl font-bold text-white mb-1">Top Performing Movies</h3>
                    <p className="text-sm text-[#808080]">Ranked by revenue</p>
                </div>

                <table className="w-full">
                    <thead className="bg-[#2A2A2A] border-b border-[#404040]">
                        <tr className="text-[#B3B3B3] text-sm">
                            <th className="text-left p-4 font-semibold">Rank</th>
                            <th className="text-left p-4 font-semibold">Movie</th>
                            <th className="text-left p-4 font-semibold">Tickets Sold</th>
                            <th className="text-left p-4 font-semibold">Revenue</th>
                            <th className="text-left p-4 font-semibold">Performance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topMovies.map((movie, index) => (
                            <tr key={index} className="border-b border-[#404040] hover:bg-[#2A2A2A] transition-colors">
                                <td className="p-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                        index === 1 ? 'bg-gray-400/20 text-gray-400' :
                                            index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-[#2A2A2A] text-[#808080]'
                                        }`}>
                                        {index + 1}
                                    </div>
                                </td>
                                <td className="p-4 text-white font-semibold">{movie.title}</td>
                                <td className="p-4 text-[#B3B3B3]">{movie.tickets.toLocaleString()}</td>
                                <td className="p-4 text-[#E50914] font-bold">{formatPrice(movie.revenue)}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-[#2A2A2A] rounded-full overflow-hidden max-w-[100px]">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#E50914] to-[#E50914]/50"
                                                style={{ width: `${(movie.tickets / topMovies[0].tickets) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-[#808080]">
                                            {Math.round((movie.tickets / topMovies[0].tickets) * 100)}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
