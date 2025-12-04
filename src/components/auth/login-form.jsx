

import { useState } from "react"

export default function LoginForm({ onSubmit, error }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-error/10 border border-error rounded text-error text-sm">{error}</div>}

      <div>
        <label className="block text-foreground font-bold mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-3 bg-secondary/10 border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-foreground font-bold mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-secondary/10 border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-primary"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary hover:bg-red-600 text-background font-bold py-3 rounded-lg transition"
      >
        Login
      </button>
    </form>
  )
}
