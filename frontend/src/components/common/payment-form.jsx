import { useState } from "react"
import { CreditCard, Lock, Shield, AlertCircle } from "lucide-react"

export default function PaymentForm({ onSubmit, isProcessing, bookingData }) {
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    paymentMethod: "credit-card"
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    let processedValue = value

    // Format card number with spaces
    if (name === "cardNumber") {
      processedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19) // Max 16 digits + 3 spaces
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

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.cardName.trim()) {
      newErrors.cardName = "Cardholder name is required"
    }

    const cardNumberDigits = formData.cardNumber.replace(/\s/g, "")
    if (cardNumberDigits.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits"
    }

    const expiryParts = formData.expiry.split("/")
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      newErrors.expiry = "Invalid expiry date (MM/YY)"
    } else {
      const month = parseInt(expiryParts[0])
      if (month < 1 || month > 12) {
        newErrors.expiry = "Invalid month"
      }
    }

    if (formData.cvv.length < 3) {
      newErrors.cvv = "CVV must be 3-4 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const paymentMethods = [
    { id: "credit-card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "momo", name: "MoMo Wallet", icon: "💳" },
    { id: "zalopay", name: "ZaloPay", icon: "💰" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <label className="block text-white font-semibold mb-4">Payment Method</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${formData.paymentMethod === method.id
                  ? 'border-[#E50914] bg-[#E50914]/10'
                  : 'border-[#404040] bg-[#2A2A2A] hover:border-[#808080]'
                }`}
            >
              <div className="flex items-center gap-3">
                {typeof method.icon === 'string' ? (
                  <span className="text-2xl">{method.icon}</span>
                ) : (
                  <method.icon className="w-6 h-6 text-white" />
                )}
                <span className="text-white font-semibold text-sm">{method.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Card Form (only show for credit card) */}
      {formData.paymentMethod === "credit-card" && (
        <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6 space-y-5">
          {/* Cardholder Name */}
          <div>
            <label className="block text-white font-semibold mb-2">Cardholder Name</label>
            <input
              type="text"
              name="cardName"
              placeholder="JOHN DOE"
              value={formData.cardName}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#2A2A2A] border-2 rounded-lg text-white placeholder-[#808080] focus:outline-none transition-colors uppercase ${errors.cardName ? 'border-red-500' : 'border-[#404040] focus:border-[#E50914]'
                }`}
            />
            {errors.cardName && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.cardName}
              </p>
            )}
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-white font-semibold mb-2">Card Number</label>
            <div className="relative">
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleChange}
                maxLength="19"
                className={`w-full px-4 py-3 bg-[#2A2A2A] border-2 rounded-lg text-white placeholder-[#808080] focus:outline-none transition-colors font-mono tracking-wider ${errors.cardNumber ? 'border-red-500' : 'border-[#404040] focus:border-[#E50914]'
                  }`}
              />
              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]" />
            </div>
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.cardNumber}
              </p>
            )}
            <p className="text-xs text-[#808080] mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Card number is never stored
            </p>
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Expiry Date</label>
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleChange}
                maxLength="5"
                className={`w-full px-4 py-3 bg-[#2A2A2A] border-2 rounded-lg text-white placeholder-[#808080] focus:outline-none transition-colors ${errors.expiry ? 'border-red-500' : 'border-[#404040] focus:border-[#E50914]'
                  }`}
              />
              {errors.expiry && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.expiry}
                </p>
              )}
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">CVV</label>
              <input
                type="password"
                name="cvv"
                placeholder="***"
                value={formData.cvv}
                onChange={handleChange}
                maxLength="4"
                className={`w-full px-4 py-3 bg-[#2A2A2A] border-2 rounded-lg text-white placeholder-[#808080] focus:outline-none transition-colors ${errors.cvv ? 'border-red-500' : 'border-[#404040] focus:border-[#E50914]'
                  }`}
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cvv}
                </p>
              )}
            </div>
          </div>

          {/* Security Badge */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-sm text-green-400 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Your payment information is secure and encrypted
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full font-bold py-4 rounded-lg transition-all duration-200 text-lg ${isProcessing
            ? "bg-[#2A2A2A] text-[#808080] cursor-not-allowed"
            : "bg-[#E50914] hover:bg-[#B20710] text-white shadow-lg shadow-[#E50914]/30"
          }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing Payment...
          </span>
        ) : (
          `Pay ${bookingData?.total ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookingData.total) : 'Now'}`
        )}
      </button>
    </form>
  )
}
