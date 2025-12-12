import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Eye, EyeOff } from 'lucide-react'
import { usersApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function ChangePasswordModal({ isOpen, onClose, onSuccess }) {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const validateForm = () => {
        const newErrors = {}

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới'
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        setErrors({})

        try {
            await usersApi.changePassword(formData.currentPassword, formData.newPassword)
            alert('Đổi mật khẩu thành công!')
            onClose()
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (err) {
            setErrors({
                submit: err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại!'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setErrors({})
        setShowPasswords({ current: false, new: false, confirm: false })
        onClose()
    }

    const handleForgotPassword = () => {
        handleClose()
        // Don't logout - just redirect to forgot password page
        navigate('/forgot-password')
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl max-w-md w-full p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Đổi Mật Khẩu</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Error message */}
                {errors.submit && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
                        <p className="text-red-400 text-sm">{errors.submit}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Mật khẩu hiện tại
                            </label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-xs text-primary hover:text-primary/80 transition-colors"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? 'text' : 'password'}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-red-400 text-sm mt-1">{errors.currentPassword}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Mật khẩu mới
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                                placeholder="Ít nhất 6 ký tự"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Xác nhận mật khẩu mới
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 bg-[#2A2A2A] hover:bg-[#333333] text-white font-semibold rounded-lg transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
