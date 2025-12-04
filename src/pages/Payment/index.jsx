

import { useState } from "react"
import Header from "../../layouts/header"
import PaymentForm from "../../components/common/payment-form"

export default function PaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handlePayment = async (formData) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Simulate network delay and potential failure
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate random payment errors for demo
      if (Math.random() > 0.8) {
        throw new Error("Network error. Please check your connection and try again.")
      }

      // Success
      window.location.href = "/confirmation"
    } catch (err) {
      setError(err.message)
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-8">
          <h1 className="text-3xl font-bold mb-8">Payment</h1>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error rounded-lg">
              <p className="text-error font-semibold mb-2">⚠ Payment Failed</p>
              <p className="text-secondary mb-4">{error}</p>
              <p className="text-secondary text-sm">Your seats have been released. Please try again.</p>
              <button
                onClick={() => (window.location.href = "/")}
                className="mt-4 text-primary hover:text-red-600 underline"
              >
                Return to Movies
              </button>
            </div>
          )}

          <PaymentForm onSubmit={handlePayment} isProcessing={isProcessing} />
        </div>
      </main>
    </>
  )
}
