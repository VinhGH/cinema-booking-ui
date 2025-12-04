

import { useState } from "react"

export default function RegisterForm({ onSubmit, error }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-error/10 border border-error rounded text-error text-sm">{error}</div>}

      <div>
        <label className="block text-foreground font-bold mb-2">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          className="w-full px-4 py-3 bg-secondary/10 border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-foreground font-bold mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="w-full px-4 py-3 bg-secondary/10 border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-foreground font-bold mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-secondary/10 border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-foreground font-bold mb-2">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-secondary/10 border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-primary"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary hover:bg-red-600 text-background font-bold py-3 rounded-lg transition"
      >
        Create Account
      </button>
    </form>
  )
}
