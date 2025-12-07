import { LayoutDashboard, Film, Calendar, BarChart3, Settings, LogOut, User } from "lucide-react"

export default function AdminNav({ activeSection, onNavigate }) {
  const sections = [
    { id: "dashboard", label: "Tổng Quan", icon: LayoutDashboard },
    { id: "movies", label: "Phim", icon: Film },
    { id: "showtimes", label: "Lịch Chiếu", icon: Calendar },
    { id: "reports", label: "Báo Cáo", icon: BarChart3 },
  ]

  return (
    <nav className="w-72 bg-[#1A1A1A] border-r border-[#404040] flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-[#404040]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E50914] rounded-lg flex items-center justify-center">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Quản Trị</h2>
            <p className="text-xs text-[#808080]">Quản Lý Rạp Chiếu Phim</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id

          return (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? "bg-[#E50914] text-white shadow-lg shadow-[#E50914]/30"
                : "text-[#B3B3B3] hover:bg-[#2A2A2A] hover:text-white"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{section.label}</span>
            </button>
          )
        })}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-[#404040]">
        <div className="flex items-center gap-3 p-3 bg-[#2A2A2A] rounded-lg mb-3">
          <div className="w-10 h-10 bg-[#404040] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Quản Trị Viên</p>
            <p className="text-[#808080] text-xs">admin@cinema.com</p>
          </div>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors duration-200">
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Đăng Xuất</span>
        </button>
      </div>
    </nav>
  )
}
