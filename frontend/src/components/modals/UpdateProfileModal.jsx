import { useState } from "react"
import { X, User, Phone, Loader } from "lucide-react"

export default function UpdateProfileModal({ isOpen, onClose, currentUser, onSuccess }) {
    const [formData, setFormData] = useState({
        full_name: currentUser?.name || currentUser?.full_name || "",
        phone: currentUser?.phone || ""
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const validateForm = () => {
        const newErrors = {}

        // Validate name
        if (!formData.full_name || formData.full_name.trim().length < 2) {
            newErrors.full_name = "Tên phải có ít nhất 2 ký tự"
        }

        // Validate phone (optional but must be valid if provided)
        if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
            newErrors.phone = "Số điện thoại phải có 10-11 chữ số"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        try {
            await onSuccess(formData)
            onClose()
        } catch (err) {
            setErrors({ submit: err.message || "Cập nhật thất bại. Vui lòng thử lại!" })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }))
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1A1A1A] border border-[#404040] rounded-2xl max-w-md w-full p-8 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Cập Nhật Thông Tin</h2>
                    <button
                        onClick={onClose}
                        className="text-[#808080] hover:text-white transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Họ và Tên <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]" />
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className={`w-full bg-[#2A2A2A] border ${errors.full_name ? "border-red-500" : "border-[#404040]"
                                    } rounded-lg pl-11 pr-4 py-3 text-white placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                                placeholder="Nhập họ và tên"
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.full_name && (
                            <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Số Điện Thoại
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full bg-[#2A2A2A] border ${errors.phone ? "border-red-500" : "border-[#404040]"
                                    } rounded-lg pl-11 pr-4 py-3 text-white placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                                placeholder="Nhập số điện thoại (10-11 số)"
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                        )}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                            <p className="text-red-500 text-sm">{errors.submit}</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-[#2A2A2A] hover:bg-[#333333] text-white font-semibold py-3 rounded-lg transition-all border border-[#404040]"
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-primary hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Đang cập nhật...
                                </>
                            ) : (
                                "Cập Nhật"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
