

export default function AdminNav({ activeSection, onNavigate }) {
  const sections = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "movies", label: "Movies", icon: "🎬" },
    { id: "showtimes", label: "Showtimes", icon: "🕐" },
    { id: "reports", label: "Reports", icon: "📈" },
  ]

  return (
    <nav className="w-64 bg-secondary/5 border-r border-border p-4 space-y-2">
      <h2 className="font-bold text-lg mb-6">Admin Panel</h2>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onNavigate(section.id)}
          className={`w-full text-left px-4 py-3 rounded-lg transition ${
            activeSection === section.id
              ? "bg-primary text-background font-bold"
              : "text-foreground hover:bg-secondary/10"
          }`}
        >
          <span className="mr-2">{section.icon}</span>
          {section.label}
        </button>
      ))}
    </nav>
  )
}
