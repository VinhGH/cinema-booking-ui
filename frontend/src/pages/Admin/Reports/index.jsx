import { useState, useEffect } from "react"
import { Download, TrendingUp, DollarSign, Ticket, Film } from "lucide-react"
import { analyticsApi } from "../../../services/api"

export default function AdminReports() {
    const [dateRange, setDateRange] = useState("6months")
    const [stats, setStats] = useState(null)
    const [revenueTrend, setRevenueTrend] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchReportsData()
    }, [dateRange])

    const fetchReportsData = async () => {
        try {
            console.log('📊 [Reports] Fetching data for:', dateRange)
            setLoading(true)
            setError(null)

            const months = dateRange === '1month' ? 1 :
                dateRange === '3months' ? 3 :
                    dateRange === '1year' ? 12 : 6

            const [statsData, trendData] = await Promise.all([
                analyticsApi.getDashboardStats(),
                analyticsApi.getRevenueTrend(months)
            ])

            console.log('✅ [Reports] Data loaded:', { statsData, trendData })

            setStats(statsData)
            setRevenueTrend(trendData)
        } catch (err) {
            console.error('❌ [Reports] Error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    const handleExport = () => {
        alert("Chức năng xuất báo cáo CSV/PDF sẽ được phát triển sau")
    }

    const maxRevenue = revenueTrend.length > 0
        ? Math.max(...revenueTrend.map(m => m.revenue))
        : 1

    const avgTicketPrice = stats && stats.ticketsSold > 0
        ? stats.totalRevenue / stats.ticketsSold
        : 0

    if (loading) {
        return (
            <div className="p-8 bg-[#0D0D0D] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                    <p className="text-white">Đang tải báo cáo...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8 bg-[#0D0D0D] min-h-screen">
                <div className="bg-red-500/10 border border-red-500 rounded-xl p-6 max-w-2xl mx-auto">
                    <p className="text-red-500 text-center">Lỗi: {error}</p>
                    <button
                        onClick={fetchReportsData}
                        className="mt-4 mx-auto block bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 bg-[#0D0D0D] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Báo Cáo Doanh Thu</h1>
                    <p className="text-[#B3B3B3]">Phân tích tài chính và thống kê</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-[#2A2A2A] border border-[#404040] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                    >
                        <option value="1month">1 Tháng Gần Đây</option>
                        <option value="3months">3 Tháng Gần Đây</option>
                        <option value="6months">6 Tháng Gần Đây</option>
                        <option value="1year">1 Năm Gần Đây</option>
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
                    <p className="text-3xl font-bold text-white">{formatPrice(stats?.totalRevenue || 0)}</p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                    <p className="text-[#808080] text-sm mb-1">Tickets Sold</p>
                    <p className="text-3xl font-bold text-white">{(stats?.ticketsSold || 0).toLocaleString('vi-VN')}</p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                    <p className="text-[#808080] text-sm mb-1">Avg Ticket Price</p>
                    <p className="text-3xl font-bold text-white">{formatPrice(avgTicketPrice)}</p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <Film className="w-6 h-6 text-red-400" />
                        </div>
                    </div>
                    <p className="text-[#808080] text-sm mb-1">Top Movie</p>
                    <p className="text-xl font-bold text-white truncate">Vua của các vua</p>
                </div>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-8 mb-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Monthly Revenue</h2>
                        <p className="text-[#808080]">Last 6 months performance</p>
                    </div>
                    <div className="bg-[#2A2A2A] px-4 py-2 rounded-lg">
                        <p className="text-sm text-[#808080]">Peak: <span className="text-white font-bold">{formatPrice(maxRevenue)}</span></p>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-80 flex items-end justify-between gap-4">
                    {revenueTrend.length > 0 ? (
                        revenueTrend.map((item, i) => {
                            const height = (item.revenue / maxRevenue) * 100
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                    <div className="w-full relative group">
                                        <div
                                            className="w-full bg-gradient-to-t from-[#E50914] to-[#E50914]/60 rounded-t-xl transition-all duration-300 hover:from-[#E50914] hover:to-[#E50914] cursor-pointer"
                                            style={{ height: `${height}%`, minHeight: '20px' }}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2A2A2A] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-10">
                                                <p className="text-white font-bold text-sm">{formatPrice(item.revenue)}</p>
                                                <p className="text-[#808080] text-xs">{item.month}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-[#808080] font-medium">{item.month.substring(5)}</span>
                                </div>
                            )
                        })
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#808080]">
                            Không có dữ liệu
                        </div>
                    )}
                </div>
            </div>

            {/* Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Distribution</h3>
                    <p className="text-sm text-[#808080] mb-4">By category</p>

                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white">Tickets</span>
                                <span className="text-[#E50914] font-bold">85%</span>
                            </div>
                            <div className="w-full bg-[#2A2A2A] rounded-full h-2">
                                <div className="bg-[#E50914] h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white">Concessions</span>
                                <span className="text-purple-400 font-bold">10%</span>
                            </div>
                            <div className="w-full bg-[#2A2A2A] rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white">Others</span>
                                <span className="text-blue-400 font-bold">5%</span>
                            </div>
                            <div className="w-full bg-[#2A2A2A] rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Quick Stats</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg">
                            <span className="text-[#B3B3B3]">Phim Đang Chiếu</span>
                            <span className="text-white font-bold text-xl">{stats?.nowShowingMovies || 0}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg">
                            <span className="text-[#B3B3B3]">Suất Chiếu Sắp Tới</span>
                            <span className="text-white font-bold text-xl">{stats?.upcomingShowtimes || 0}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg">
                            <span className="text-[#B3B3B3]">Tổng Vé Đã Bán</span>
                            <span className="text-white font-bold text-xl">{(stats?.ticketsSold || 0).toLocaleString('vi-VN')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
