

import { useState } from "react"

export default function PaymentForm({ onSubmit, isProcessing }) {
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    let processedValue = value

    // Format card number with spaces
    if (name === "cardNumber") {
      processedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
    }

    // Format expiry date
    if (name === "expiry") {
      processedValue = value.replace(/\D/g, "").slice(0, 4)
      if (processedValue.length >= 2) {
        processedValue = processedValue.slice(0, 2) + "/" + processedValue.slice(2)
      }
    }

    // Limit CVV to 4 digits
    if (name === "cvv") {
      processedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const maskCardNumber = (num) => {
    const last4 = num.slice(-4)
    return "**** **** **** " + last4
  }

  return (
    <form onSubmit={handleSubmit} className="bg-secondary/5 border border-border p-8 rounded-lg space-y-6">
      <div>
        <label className="block text-foreground font-bold mb-2">Cardholder Name</label>
        <input
          type="text"
          name="cardName"
          placeholder="John Doe"
          value={formData.cardName}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-foreground font-bold mb-2">Card Number</label>
        <input
          type="text"
          name="cardNumber"
          placeholder="4532 1234 5678 9999"
          value={formData.cardNumber}
          onChange={handleChange}
          maxLength="19"
          required
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-primary font-mono tracking-wider"
        />
        <p className="text-xs text-secondary mt-2">Card number is never stored</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-foreground font-bold mb-2">Expiry Date</label>
          <input
            type="text"
            name="expiry"
            placeholder="MM/YY"
            value={formData.expiry}
            onChange={handleChange}
            maxLength="5"
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-foreground font-bold mb-2">CVV</label>
          <input
            type="text"
            name="cvv"
            placeholder="***"
            value={formData.cvv}
            onChange={handleChange}
            maxLength="4"
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-warning/10 border border-warning/50 p-4 rounded-lg">
        <p className="text-sm text-secondary">✓ Your payment information is secure and encrypted</p>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full font-bold py-3 rounded-lg transition ${
          isProcessing
            ? "bg-secondary/20 text-secondary cursor-not-allowed"
            : "bg-primary hover:bg-red-600 text-background"
        }`}
      >
        {isProcessing ? "⏳ Processing..." : "Pay Now"}
      </button>
    </form>
  )
}
