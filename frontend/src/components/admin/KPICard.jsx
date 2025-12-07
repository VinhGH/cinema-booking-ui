import { TrendingUp, TrendingDown } from "lucide-react"

export default function KPICard({ title, value, change, icon: Icon, trend = "up" }) {
  const isPositive = trend === "up"

  return (
    <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6 hover:border-[#E50914] transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          isPositive ? 'bg-green-500/10' : 'bg-red-500/10'
        }`}>
          <Icon className={`w-6 h-6 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
          isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-bold">{change}</span>
        </div>
      </div>

      <div>
        <p className="text-[#808080] text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  )
}
