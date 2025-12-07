import { useState } from "react"
import Header from "../../layouts/header"
import Footer from "../../layouts/footer"
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Instagram, Linkedin, MessageCircle } from "lucide-react"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission
        console.log("Form submitted:", formData)
        alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.")
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background pt-24">
                {/* Page Header */}
                <section className="relative bg-gradient-to-r from-primary/20 to-transparent p-8 md:p-16 border-b border-white/10">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <MessageCircle className="w-10 h-10 text-primary" />
                            <h1 className="text-4xl md:text-5xl font-bold text-balance">Liên Hệ</h1>
                        </div>
                        <p className="text-secondary text-lg">
                            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <section className="max-w-6xl mx-auto px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Contact Information */}
                        <div className="space-y-6">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">Thông Tin Liên Hệ</h2>

                                <div className="space-y-6">
                                    {/* Address */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                                            <MapPin className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white mb-1">Địa Chỉ</h3>
                                            <p className="text-gray-300 leading-relaxed">
                                                403 Tôn Đức Thắng - Phường Hòa Minh - Quận Liên Chiểu - TP. Đà Nẵng
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                                            <Phone className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white mb-1">Điện Thoại</h3>
                                            <a href="tel:0339464751" className="text-primary hover:text-red-400 transition-colors text-lg font-bold">
                                                0339.464.751
                                            </a>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                                            <Mail className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                                            <a href="mailto:contact@cinebook.vn" className="text-primary hover:text-red-400 transition-colors">
                                                contact@cinebook.vn
                                            </a>
                                            <br />
                                            <a href="https://www.cinebook.vn" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                                www.cinebook.vn
                                            </a>
                                        </div>
                                    </div>

                                    {/* Working Hours */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                                            <Clock className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white mb-1">Giờ Làm Việc</h3>
                                            <p className="text-gray-300">Thứ 2 - Chủ Nhật: 8:00 - 23:00</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Media */}
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <h3 className="text-lg font-bold text-white mb-4">Kết Nối Với Chúng Tôi</h3>
                                    <div className="flex flex-wrap gap-3">
                                        <a
                                            href="https://facebook.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                                        >
                                            <Facebook className="w-6 h-6 text-white" />
                                        </a>
                                        <a
                                            href="https://twitter.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                                        >
                                            <Twitter className="w-6 h-6 text-white" />
                                        </a>
                                        <a
                                            href="https://instagram.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                                        >
                                            <Instagram className="w-6 h-6 text-white" />
                                        </a>
                                        <a
                                            href="https://linkedin.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 bg-blue-700 hover:bg-blue-800 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                                        >
                                            <Linkedin className="w-6 h-6 text-white" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Gửi Tin Nhắn</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                        Họ và Tên <span className="text-primary">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
                                        placeholder="Nhập họ và tên của bạn"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                            Email <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                                            Số Điện Thoại
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
                                            placeholder="0123456789"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                                        Tiêu Đề <span className="text-primary">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
                                        placeholder="Tiêu đề tin nhắn"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                        Nội Dung <span className="text-primary">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all resize-none"
                                        placeholder="Nhập nội dung tin nhắn của bạn..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 bg-primary hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Gửi Tin Nhắn
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="max-w-6xl mx-auto px-8 py-12">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-16 h-16 text-white/50 mx-auto mb-4" />
                                <p className="text-gray-400">Google Maps sẽ được tích hợp tại đây</p>
                                <p className="text-sm text-gray-500 mt-2">403 Tôn Đức Thắng, Hòa Minh, Liên Chiểu, Đà Nẵng</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
