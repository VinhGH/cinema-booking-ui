import { DollarSign, Ticket, Film, Calendar, TrendingUp, Activity } from "lucide-react"
import KPICard from "../../../components/admin/KPICard"

export default function AdminDashboard() {
  const kpis = [
    {
      title: "Tổng Doanh Thu",
      value: "₫125.5M",
      change: "+12%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Vé Đã Bán",
      value: "2,847",
      change: "+8%",
      icon: Ticket,
      trend: "up"
    },
    {
      title: "Phim Đang Chiếu",
      value: "12",
      change: "+2",
      icon: Film,
      trend: "up"
    },
    {
      title: "Suất Chiếu Sắp Tới",
      value: "48",
      change: "+5",
      icon: Calendar,
      trend: "up"
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "booking",
      movie: "Dune: Part Two",
      user: "John Doe",
      seats: "A5, A6",
      amount: "₫300,000",
      status: "confirmed",
      time: "5 mins ago"
    },
    {
      id: 2,
      type: "booking",
      movie: "The Dark Knight",
      user: "Jane Smith",
      seats: "C10, C11, C12",
      amount: "₫450,000",
      status: "confirmed",
      time: "12 mins ago"
    },
    {
      id: 3,
      type: "cancellation",
      movie: "Inception",
      user: "Bob Johnson",
      seats: "B8",
      amount: "₫150,000",
      status: "cancelled",
      time: "25 mins ago"
    },
    {
      id: 4,
      type: "booking",
      movie: "Interstellar",
      user: "Alice Brown",
      seats: "D5, D6",
      amount: "₫300,000",
      status: "pending",
      time: "1 hour ago"
    },
  ]

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
        {/* Revenue Chart Placeholder */}
        <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Xu Hướng Doanh Thu</h3>
              <p className="text-sm text-[#808080]">6 tháng gần đây</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>

          {/* Simple Chart Placeholder */}
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 80, 75, 90, 85, 95].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-[#E50914] to-[#E50914]/50 rounded-t-lg transition-all duration-300 hover:from-[#E50914] hover:to-[#E50914]"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-[#808080]">M{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Distribution Placeholder */}
        <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Phân Bổ Vé</h3>
              <p className="text-sm text-[#808080]">Theo thể loại phim</p>
            </div>
            <Activity className="w-6 h-6 text-[#E50914]" />
          </div>

          {/* Simple Pie Chart Placeholder */}
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E50914] via-purple-600 to-blue-600 opacity-80" />
              <div className="absolute inset-8 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">2,847</p>
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
          <button className="text-[#E50914] hover:text-[#B20710] font-semibold text-sm transition-colors duration-200">
            Xem Tất Cả →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2A2A2A] border-b border-[#404040]">
              <tr className="text-[#B3B3B3] text-sm">
                <th className="text-left p-4 font-semibold">Phim</th>
                <th className="text-left p-4 font-semibold">Người Dùng</th>
                <th className="text-left p-4 font-semibold">Ghế</th>
                <th className="text-left p-4 font-semibold">Số Tiền</th>
                <th className="text-left p-4 font-semibold">Trạng Thái</th>
                <th className="text-left p-4 font-semibold">Thời Gian</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity) => (
                <tr
                  key={activity.id}
                  className="border-b border-[#404040] hover:bg-[#2A2A2A] transition-colors duration-200"
                >
                  <td className="p-4">
                    <p className="text-white font-semibold">{activity.movie}</p>
                  </td>
                  <td className="p-4 text-[#B3B3B3]">{activity.user}</td>
                  <td className="p-4 text-[#B3B3B3]">{activity.seats}</td>
                  <td className="p-4">
                    <span className="text-white font-bold">{activity.amount}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(activity.status)}`}>
                      {activity.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-[#808080] text-sm">{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
