export default function AdminDashboard() {
  const kpis = [
    { label: "Total Revenue", value: "$125,500", change: "+12%" },
    { label: "Tickets Sold", value: "2,847", change: "+8%" },
    { label: "Active Movies", value: "12", change: "+2" },
    { label: "Occupancy Rate", value: "78%", change: "+5%" },
  ]

  const recentBookings = [
    { id: 1, movie: "Dune: Part Two", seats: 3, revenue: "$450", status: "confirmed" },
    { id: 2, movie: "The Dark Knight", seats: 2, revenue: "$300", status: "confirmed" },
    { id: 3, movie: "Inception", seats: 4, revenue: "$600", status: "pending" },
  ]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-secondary/5 border border-border p-6 rounded-lg">
            <p className="text-secondary text-sm mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold text-foreground mb-1">{kpi.value}</p>
            <p className="text-success text-sm">↑ {kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-secondary/5 border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-bold text-lg">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-secondary">
                <th className="text-left p-4 font-bold">Movie</th>
                <th className="text-left p-4 font-bold">Seats</th>
                <th className="text-left p-4 font-bold">Revenue</th>
                <th className="text-left p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border hover:bg-secondary/5 transition">
                  <td className="p-4">{booking.movie}</td>
                  <td className="p-4">{booking.seats}</td>
                  <td className="p-4 font-bold text-primary">{booking.revenue}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        booking.status === "confirmed" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                      }`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
