import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../layouts/header"
import Footer from "../../layouts/footer"
import { useAuth } from "../../context/AuthContext"
import { User, Phone, Mail, QrCode, Star, Ticket, Lock, Edit, History, FileText, Award } from "lucide-react"

export default function ProfilePage() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("cinema")

    if (!user) {
        navigate("/login")
        return null
    }

    // Mock data
    const userInfo = {
        name: user.name || "Nguyễn Văn A",
        phone: "0339464751",
        email: user.email || "thaivinhsonchip@gmail.com",
        loyaltyPoints: 0,
        rewardPoints: 0,
        qrCode: "QR_CODE_DATA_HERE"
    }

    const transactionHistory = []

    const tabs = [
        { id: "cinema", label: "Rạp" },
        { id: "movie", label: "Tên phim" },
        { id: "total", label: "Tổng tiền" },
        { id: "points", label: "Điểm thưởng" }
    ]

    const menuItems = [
        { icon: Lock, label: "Đổi mật khẩu", action: () => alert("Chức năng đổi mật khẩu") },
        { icon: Edit, label: "Cập nhật thông tin", action: () => alert("Chức năng cập nhật thông tin") },
        { icon: History, label: "Lịch sử giao dịch online", action: () => navigate("/tickets") },
        { icon: FileText, label: "Chính sách thanh toán", action: () => alert("Chính sách thanh toán") },
        { icon: Award, label: "Chính sách thành viên", action: () => alert("Chính sách thành viên") }
    ]

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background pt-24 pb-12">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Sidebar - User Info */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* User Card */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">{userInfo.name}</h2>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <div className="flex items-center justify-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <span>{userInfo.phone}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span className="break-all">{userInfo.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                                <div className="bg-white rounded-2xl p-6 flex items-center justify-center aspect-square">
                                    <QrCode className="w-full h-full text-gray-800" />
                                </div>
                            </div>

                            {/* Points */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-primary text-sm font-medium mb-1">Điểm tích lũy</div>
                                        <div className="text-3xl font-bold text-white">{userInfo.loyaltyPoints}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-primary text-sm font-medium mb-1">Điểm thưởng</div>
                                        <div className="text-3xl font-bold text-white">{userInfo.rewardPoints}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 space-y-2">
                                {menuItems.map((item, index) => {
                                    const Icon = item.icon
                                    return (
                                        <button
                                            key={index}
                                            onClick={item.action}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                                        >
                                            <Icon className="w-5 h-5 text-primary" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Right Content - Transaction History */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">Lịch Sử Giao Dịch</h2>

                                {/* Tabs */}
                                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-shrink-0 px-6 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Transaction List */}
                                <div className="min-h-[400px]">
                                    {transactionHistory.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-24">
                                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                <Ticket className="w-12 h-12 text-gray-600" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Không có dữ liệu</h3>
                                            <p className="text-gray-400 text-center max-w-md">
                                                Bạn chưa có giao dịch nào. Hãy đặt vé xem phim để tích lũy điểm thưởng!
                                            </p>
                                            <button
                                                onClick={() => navigate("/")}
                                                className="mt-6 px-6 py-3 bg-primary hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
                                            >
                                                Đặt Vé Ngay
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {transactionHistory.map((transaction, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-bold text-white mb-2">{transaction.movieTitle}</h3>
                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <span className="text-gray-400">Rạp: </span>
                                                                    <span className="text-white">{transaction.cinema}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400">Ngày: </span>
                                                                    <span className="text-white">{transaction.date}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400">Giờ: </span>
                                                                    <span className="text-white">{transaction.time}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400">Ghế: </span>
                                                                    <span className="text-white">{transaction.seats}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right ml-4">
                                                            <div className="text-2xl font-bold text-primary mb-1">
                                                                {transaction.total.toLocaleString('vi-VN')}đ
                                                            </div>
                                                            <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                                                <Star className="w-4 h-4 fill-current" />
                                                                <span>+{transaction.points} điểm</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
