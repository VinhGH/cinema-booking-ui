import { useState, useEffect } from "react"
import { DollarSign, Ticket, Film, Calendar, TrendingUp, Activity } from "lucide-react"
import KPICard from "../../../components/admin/KPICard"
import { analyticsApi } from "../../../services/api"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [revenueTrend, setRevenueTrend] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      console.log('📊 [Dashboard] Fetching analytics data...')
      setLoading(true)
      setError(null)

      const [statsData, trendData, activitiesData] = await Promise.all([
        analyticsApi.getDashboardStats(),
        analyticsApi.getRevenueTrend(6),
        analyticsApi.getRecentBookings(10)
      ])

      console.log('✅ [Dashboard] Data loaded:', { statsData, trendData, activitiesData })

      setStats(statsData)
      setRevenueTrend(trendData)
      setRecentActivities(activitiesData)
    } catch (err) {
      console.error('❌ [Dashboard] Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} giờ trước`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} ngày trước`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/30"
      default:
        return "bg-[#2A2A2A] text-[#B3B3B3] border-[#404040]"
    }
  }

  const kpis = stats ? [
    {
      title: "Tổng Doanh Thu",
      value: formatCurrency(stats.totalRevenue),
      change: "+12%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Vé Đã Bán",
      value: stats.ticketsSold.toLocaleString('vi-VN'),
      change: "+8%",
      icon: Ticket,
      trend: "up"
    },
    {
      title: "Phim Đang Chiếu",
      value: stats.nowShowingMovies.toString(),
      change: "+2",
      icon: Film,
      trend: "up"
    },
    {
      title: "Suất Chiếu Sắp Tới",
      value: stats.upcomingShowtimes.toString(),
      change: "+5",
      icon: Calendar,
      trend: "up"
    },
  ] : []

  if (loading) {
    return (
      <div className="p-8 bg-[#0D0D0D] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-white">Đang tải dữ liệu...</p>
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
            onClick={fetchDashboardData}
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
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Tổng Quan</h1>
        <p className="text-[#B3B3B3]">Tổng quan hiệu suất rạp chiếu phim của bạn</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <KPICard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            icon={kpi.icon}
            trend={kpi.trend}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Xu Hướng Doanh Thu</h3>
              <p className="text-sm text-[#808080]">6 tháng gần đây</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>

          {/* Revenue Chart */}
          <div className="h-64 flex items-end justify-between gap-2">
            {revenueTrend.length > 0 ? (
              revenueTrend.map((item, i) => {
                const maxRevenue = Math.max(...revenueTrend.map(r => r.revenue))
                const height = (item.revenue / maxRevenue) * 100
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-[#E50914] to-[#E50914]/50 rounded-t-lg transition-all duration-300 hover:from-[#E50914] hover:to-[#E50914] relative group"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2A2A2A] px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                        {formatCurrency(item.revenue)}
                      </div>
                    </div>
                    <span className="text-xs text-[#808080]">{item.month.substring(5)}</span>
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

        {/* Ticket Distribution Placeholder */}
        <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Phân Bổ Vé</h3>
              <p className="text-sm text-[#808080]">Tổng số vé đã bán</p>
            </div>
            <Activity className="w-6 h-6 text-[#E50914]" />
          </div>

          {/* Simple Pie Chart Placeholder */}
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E50914] via-purple-600 to-blue-600 opacity-80" />
              <div className="absolute inset-8 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{stats?.ticketsSold.toLocaleString('vi-VN')}</p>
                  <p className="text-sm text-[#808080]">Tổng Số Vé</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#404040] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Hoạt Động Gần Đây</h3>
            <p className="text-sm text-[#808080]">Đặt vé và hủy vé mới nhất</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="text-[#E50914] hover:text-[#B20710] font-semibold text-sm transition-colors duration-200"
          >
            Làm mới →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2A2A2A] border-b border-[#404040]">
              <tr className="text-[#B3B3B3] text-sm">
                <th className="text-left p-4 font-semibold">Mã Vé</th>
                <th className="text-left p-4 font-semibold">Phim</th>
                <th className="text-left p-4 font-semibold">Người Dùng</th>
                <th className="text-left p-4 font-semibold">Ghế</th>
                <th className="text-left p-4 font-semibold">Số Tiền</th>
                <th className="text-left p-4 font-semibold">Trạng Thái</th>
                <th className="text-left p-4 font-semibold">Thời Gian</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="border-b border-[#404040] hover:bg-[#2A2A2A] transition-colors duration-200"
                  >
                    <td className="p-4">
                      <p className="text-white font-mono text-sm">{activity.booking_code}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-semibold">{activity.movie_title}</p>
                    </td>
                    <td className="p-4 text-[#B3B3B3]">{activity.user_name}</td>
                    <td className="p-4 text-[#B3B3B3]">{activity.seats.join(', ')}</td>
                    <td className="p-4">
                      <span className="text-white font-bold">{formatCurrency(activity.final_amount)}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(activity.status)}`}>
                        {activity.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-[#808080] text-sm">{formatTimeAgo(activity.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#808080]">
                    Chưa có hoạt động nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
