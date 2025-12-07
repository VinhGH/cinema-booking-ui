import { useState } from "react"
import Header from "../../layouts/header"
import Footer from "../../layouts/footer"
import { HelpCircle, Film, CreditCard, ShoppingCart, ChevronRight, Phone, Mail, MapPin, Clock } from "lucide-react"

const FAQ_CATEGORIES = [
    {
        id: "cinema",
        title: "Rạp Chiếu Phim",
        icon: Film,
        questions: [
            {
                q: "Phân loại độ tuổi xem phim tại RIO Cinemas?",
                a: "P: Phim được phổ biến đến người xem ở mọi độ tuổi.\nK: Phim được phổ biến đến người xem dưới 13 tuổi với điều kiện xem cùng cha, mẹ hoặc người giám hộ.\nC13: Phim cấm khán giả dưới 13 tuổi.\nC16: Phim cấm khán giả dưới 16 tuổi.\nC18: Phim cấm khán giả dưới 18 tuổi.\n\nKhách hàng vui lòng chứng minh độ tuổi của mình khi mua vé hoặc khi vào phòng chiếu. RIO Cinemas có quyền từ chối bán vé và không hoàn trả lại tiền vé khi khách hàng không tuân thủ quy định này."
            },
            {
                q: "Lịch chiếu phim tại RIO Cinemas",
                a: "Lịch chiếu phim được cập nhật hàng ngày trên website và ứng dụng di động của RIO Cinemas. Quý khách có thể xem lịch chiếu theo ngày, theo phim hoặc theo rạp."
            },
            {
                q: "Quy định xem phim tại RIO Cinemas",
                a: "- Vui lòng đến trước giờ chiếu 15 phút để làm thủ tục vào phòng chiếu.\n- Không mang thức ăn, đồ uống từ bên ngoài vào rạp.\n- Không gây ồn ào, sử dụng điện thoại trong phòng chiếu.\n- Không quay phim, chụp ảnh trong suất chiếu.\n- Giữ gìn vệ sinh chung."
            }
        ]
    },
    {
        id: "booking",
        title: "Hướng Dẫn",
        icon: HelpCircle,
        questions: [
            {
                q: "Làm thế nào để đặt vé online?",
                a: "Bước 1: Truy cập website hoặc ứng dụng RIO Cinemas.\nBước 2: Chọn phim, rạp, suất chiếu và ghế ngồi.\nBước 3: Điền thông tin và thanh toán online.\nBước 4: Nhận mã QR qua email hoặc SMS.\nBước 5: Xuất trình mã QR tại quầy để nhận vé."
            },
            {
                q: "Điều kiện hủy vé và hoàn tiền?",
                a: "- Vé đã mua chỉ được hủy trước giờ chiếu ít nhất 24 giờ.\n- Phí hủy vé: 10% giá trị vé.\n- Tiền hoàn sẽ được chuyển về tài khoản trong vòng 5-7 ngày làm việc.\n- Vé khuyến mãi, vé combo không được hoàn trả."
            },
            {
                q: "Hướng dẫn đổi vé",
                a: "Quý khách có thể đổi vé sang suất chiếu khác (cùng phim) trước giờ chiếu ít nhất 2 giờ. Vui lòng liên hệ hotline hoặc đến quầy vé để được hỗ trợ."
            }
        ]
    },
    {
        id: "pricing",
        title: "Bảng Giá Vé",
        icon: CreditCard,
        questions: [
            {
                q: "Giá vé xem phim tại RIO Cinemas",
                a: "Giá vé phụ thuộc vào:\n- Loại phim (2D, 3D, IMAX)\n- Thời gian chiếu (sáng, chiều, tối)\n- Ngày trong tuần (thứ 2-5, cuối tuần)\n- Vị trí ghế (thường, VIP, couple)\n\nGiá vé dao động từ 45.000đ - 150.000đ/vé.\nVui lòng xem chi tiết trên website hoặc liên hệ hotline."
            },
            {
                q: "Ưu đãi giá vé",
                a: "- Thứ 3 hàng tuần: Vé 2D chỉ 45K\n- Thứ 5 Happy Day: Vé 2D chỉ 45K\n- Sinh viên: Giảm 20% (thứ 2-5)\n- Suất sáng: Vé từ 45K\n- Thành viên: Tích điểm đổi quà"
            }
        ]
    },
    {
        id: "concession",
        title: "Bảng Giá Bắp Nước",
        icon: ShoppingCart,
        questions: [
            {
                q: "Menu bắp nước tại RIO Cinemas",
                a: "Combo 1 (1 người): 1 bắp + 1 nước - 60.000đ\nCombo 2 (2 người): 1 bắp lớn + 2 nước - 100.000đ\nCombo 3 (Gia đình): 2 bắp lớn + 4 nước - 180.000đ\n\nBắp rang bơ: S (40K), M (50K), L (60K)\nNước ngọt: S (25K), M (30K), L (35K)\nSnack khác: 20K - 40K"
            },
            {
                q: "Chính sách đổi trả bắp nước",
                a: "- Bắp nước chỉ được đổi trong vòng 5 phút kể từ khi mua nếu có lỗi từ phía rạp.\n- Không hoàn tiền với bắp nước đã mua.\n- Vui lòng kiểm tra kỹ trước khi rời quầy."
            }
        ]
    }
]

export default function SupportPage() {
    const [selectedCategory, setSelectedCategory] = useState("cinema")
    const [expandedQuestion, setExpandedQuestion] = useState(null)

    const currentCategory = FAQ_CATEGORIES.find(cat => cat.id === selectedCategory)

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background pt-24">
                {/* Page Header */}
                <section className="relative bg-gradient-to-r from-primary/20 to-transparent p-8 md:p-16 border-b border-white/10">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <HelpCircle className="w-10 h-10 text-primary" />
                            <h1 className="text-4xl md:text-5xl font-bold text-balance">Hỗ Trợ Khách Hàng</h1>
                        </div>
                        <p className="text-secondary text-lg">
                            Câu hỏi thường gặp và hướng dẫn sử dụng dịch vụ
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <section className="max-w-6xl mx-auto px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar Categories */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 sticky top-24">
                                <h3 className="text-lg font-bold text-white mb-4 px-2">Danh Mục</h3>
                                <nav className="space-y-2">
                                    {FAQ_CATEGORIES.map((category) => {
                                        const Icon = category.icon
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${selectedCategory === category.id
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                        : 'text-gray-400 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="text-sm font-medium">{category.title}</span>
                                                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${selectedCategory === category.id ? 'rotate-90' : ''
                                                    }`} />
                                            </button>
                                        )
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* FAQ Content */}
                        <div className="lg:col-span-3 space-y-4">
                            {currentCategory && (
                                <>
                                    <div className="bg-gradient-to-r from-primary/20 to-transparent backdrop-blur-md border border-white/10 rounded-2xl p-6">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                            {currentCategory.icon && <currentCategory.icon className="w-6 h-6 text-primary" />}
                                            {currentCategory.title}
                                        </h2>
                                    </div>

                                    {currentCategory.questions.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
                                        >
                                            <button
                                                onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                                                className="w-full flex items-start gap-4 p-6 text-left hover:bg-white/5 transition-all"
                                            >
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <span className="text-primary font-bold text-sm">Q</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-white mb-1">{item.q}</h3>
                                                </div>
                                                <ChevronRight className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${expandedQuestion === index ? 'rotate-90' : ''
                                                    }`} />
                                            </button>

                                            {expandedQuestion === index && (
                                                <div className="px-6 pb-6 pl-18">
                                                    <div className="bg-white/5 rounded-xl p-4 border-l-4 border-primary">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                                                <span className="text-green-500 font-bold text-xs">A</span>
                                                            </div>
                                                            <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                                                                {item.a}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="max-w-6xl mx-auto px-8 py-12">
                    <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">Vẫn Cần Hỗ Trợ?</h2>
                        <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
                            Nếu bạn không tìm thấy câu trả lời, vui lòng liên hệ với chúng tôi qua các kênh sau:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-all">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Hotline</h3>
                                <p className="text-primary font-bold text-xl">1900 1234</p>
                                <p className="text-gray-400 text-sm mt-2">8:00 - 22:00 hàng ngày</p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-all">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Email</h3>
                                <p className="text-primary font-bold">support@cinebook.vn</p>
                                <p className="text-gray-400 text-sm mt-2">Phản hồi trong 24h</p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-all">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Địa Chỉ</h3>
                                <p className="text-gray-300 text-sm">123 Nguyễn Huệ, Q.1</p>
                                <p className="text-gray-300 text-sm">TP. Hồ Chí Minh</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
