

import { useState } from "react"

export default function SearchBar() {
  const [search, setSearch] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search logic
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 px-4 py-3 bg-secondary/10 border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-primary"
      />
      <button
        type="submit"
        className="bg-primary hover:bg-red-600 text-background font-bold px-8 py-3 rounded-lg transition"
      >
        Search
      </button>
    </form>
  )
}
