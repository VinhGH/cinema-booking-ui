import { Link } from "react-router-dom"
import { Facebook, Youtube, Instagram, Mail, Phone, MapPin, Download } from "lucide-react"
import translations from "../utils/translations"

export default function Footer() {
    const t = translations.footer

    return (
        <footer className="relative bg-gradient-to-b from-background to-black/50 border-t border-white/10">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* CineBook Info */}
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-4">CineBook</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Hệ thống rạp chiếu phim hiện đại, mang đến trải nghiệm điện ảnh tuyệt vời nhất.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all"
                            >
                                <Facebook className="w-5 h-5 text-white" />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all"
                            >
                                <Youtube className="w-5 h-5 text-white" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all"
                            >
                                <Instagram className="w-5 h-5 text-white" />
                            </a>
                            <a
                                href="mailto:info@cinebook.vn"
                                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all"
                            >
                                <Mail className="w-5 h-5 text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Giới Thiệu</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    Về CineBook
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    Điều Khoản Sử Dụng
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    Chính Sách Bảo Mật
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    Câu Hỏi Thường Gặp
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Hỗ Trợ</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/support" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    Hỗ Trợ Khách Hàng
                                </Link>
                            </li>
                            <li>
                                <Link to="/booking-guide" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    Hướng Dẫn Đặt Vé
                                </Link>
                            </li>
                            <li>
                                <Link to="/payment-guide" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    Hướng Dẫn Thanh Toán
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">
                                    Liên Hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Download App */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Tải Ứng Dụng</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Đặt vé nhanh chóng và tiện lợi hơn với ứng dụng CineBook
                        </p>
                        <div className="space-y-3">
                            <a
                                href="#"
                                className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/20 transition-all"
                            >
                                <Download className="w-5 h-5 text-white" />
                                <div>
                                    <p className="text-xs text-gray-400">Tải trên</p>
                                    <p className="text-sm font-bold text-white">App Store</p>
                                </div>
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/20 transition-all"
                            >
                                <Download className="w-5 h-5 text-white" />
                                <div>
                                    <p className="text-xs text-gray-400">Tải trên</p>
                                    <p className="text-sm font-bold text-white">Google Play</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 my-8"></div>

                {/* Company Info */}
                <div className="space-y-3 mb-8">
                    <h4 className="text-white font-bold text-lg">CÔNG TY TNHH DỊCH VỤ GIẢI TRÍ CINEBOOK</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                            <p>Địa chỉ: 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                            <p>Điện thoại: 1900 1234</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                            <p>Email: info@cinebook.vn</p>
                        </div>
                        <div>
                            <p>Giấy phép kinh doanh số: 0123456789</p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 pt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        © 2024 CineBook. All Rights Reserved. Designed by{" "}
                        <span className="text-primary font-medium">CineBook Team</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}
