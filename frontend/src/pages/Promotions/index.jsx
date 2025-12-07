import { useState } from "react"
import { Link } from "react-router-dom"
import Header from "../../layouts/header"
import Footer from "../../layouts/footer"
import { Calendar, Tag, Gift, Ticket, ArrowRight } from "lucide-react"

const PROMOTIONS = [
    {
        id: 1,
        title: "RIO DAY - THỨ 5 HÀNG TUẦN",
        image: "/img/promo-rio-day.jpg",
        date: "19 Thg3 2025",
        category: "Khuyến Mãi",
        description: "COMBO RIO 1+1: Suất chiếu 2D/3D + 02 bắp + 02 nước chỉ với 220k - 240k! Áp dụng cho thành viên của RIO.",
        discount: "Giảm 50%",
        validUntil: "31/12/2025"
    },
    {
        id: 2,
        title: "THỨ 3 NHẠN NHƯA GIÁ - CÙNG ĐÓN PHIM HAY",
        image: "/img/promo-tuesday.jpg",
        date: "27 Thg1 2025",
        category: "Ưu Đãi Đặc Biệt",
        description: "Vé xem phim 2D chỉ từ 45k cho tất cả các suất chiếu vào thứ 3 hàng tuần. Không giới hạn số lượng!",
        discount: "Chỉ 45K",
        validUntil: "31/12/2025"
    },
    {
        id: 3,
        title: "THỨ 3 NHẠN NHƯA GIÁ - CÙNG ĐÓN PHIM HAY",
        image: "/img/promo-student.jpg",
        date: "15 Thg2 2025",
        category: "Sinh Viên",
        description: "Sinh viên được giảm 20% cho tất cả các suất chiếu khi xuất trình thẻ sinh viên. Áp dụng từ thứ 2 đến thứ 5.",
        discount: "Giảm 20%",
        validUntil: "30/06/2025"
    },
    {
        id: 4,
        title: "THỨ 5 HÀNG TUẦN - HAPPY DAY",
        image: "/img/promo-happy-day.jpg",
        date: "10 Thg3 2025",
        category: "Happy Day",
        description: "Đồng giá vé 45K cho tất cả các suất chiếu vào thứ 5. Áp dụng cho tất cả các phim đang chiếu.",
        discount: "45K/vé",
        validUntil: "31/12/2025"
    },
    {
        id: 5,
        title: "XEM PHIM SÁNG - SĂNG KHUYA",
        image: "/img/promo-morning.jpg",
        date: "05 Thg1 2025",
        category: "Suất Sáng",
        description: "Vé xem phim suất sáng (trước 12h) chỉ từ 45K. Combo bắp nước giảm 30%. Thứ 6, 7, CN & ngày lễ.",
        discount: "Từ 45K",
        validUntil: "31/12/2025"
    },
    {
        id: 6,
        title: "COMBO GIA ĐÌNH - TIẾT KIỆM NHẤT",
        image: "/img/promo-family.jpg",
        date: "20 Thg2 2025",
        category: "Gia Đình",
        description: "Mua 4 vé được tặng 1 combo bắp nước lớn. Áp dụng cho các suất chiếu cuối tuần và ngày lễ.",
        discount: "Tặng Combo",
        validUntil: "31/12/2025"
    }
]

export default function PromotionsPage() {
    const [selectedCategory, setSelectedCategory] = useState("all")

    const categories = ["all", "Khuyến Mãi", "Ưu Đãi Đặc Biệt", "Sinh Viên", "Happy Day", "Suất Sáng", "Gia Đình"]

    const filteredPromotions = selectedCategory === "all"
        ? PROMOTIONS
        : PROMOTIONS.filter(promo => promo.category === selectedCategory)

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background pt-24">
                {/* Page Header */}
                <section className="relative bg-gradient-to-r from-primary/20 to-transparent p-8 md:p-16 border-b border-white/10">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <Gift className="w-10 h-10 text-primary" />
                            <h1 className="text-4xl md:text-5xl font-bold text-balance">Ưu Đãi Đặc Biệt</h1>
                        </div>
                        <p className="text-secondary text-lg">
                            Khám phá các chương trình khuyến mãi hấp dẫn từ CineBook
                        </p>
                    </div>
                </section>

                {/* Category Filter */}
                <section className="bg-background border-b border-white/10 sticky top-20 z-10 backdrop-blur-md bg-background/95">
                    <div className="max-w-6xl mx-auto px-8 py-4">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-xl border transition-all text-sm font-medium ${selectedCategory === category
                                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {category === "all" ? "Tất Cả" : category}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Promotions Grid */}
                <section className="max-w-6xl mx-auto px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPromotions.map((promo) => (
                            <div
                                key={promo.id}
                                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                            >
                                {/* Discount Badge */}
                                <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary rounded-full text-xs font-bold text-white shadow-lg shadow-primary/50">
                                    {promo.discount}
                                </div>

                                {/* Image */}
                                <div className="relative aspect-[16/9] overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                                        <Gift className="w-20 h-20 text-white/30" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-3">
                                    {/* Category & Date */}
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1 text-primary">
                                            <Tag className="w-3 h-3" />
                                            {promo.category}
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            {promo.date}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                                        {promo.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-400 line-clamp-3">
                                        {promo.description}
                                    </p>

                                    {/* Valid Until */}
                                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-white/10">
                                        <Ticket className="w-3 h-3" />
                                        <span>Có hiệu lực đến: {promo.validUntil}</span>
                                    </div>

                                    {/* View More Button */}
                                    <button className="w-full mt-4 px-4 py-2 bg-white/10 hover:bg-primary border border-white/10 hover:border-primary rounded-xl text-sm font-medium text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20">
                                        Xem Thêm
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredPromotions.length === 0 && (
                        <div className="text-center py-24">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 max-w-md mx-auto">
                                <Gift className="w-24 h-24 mx-auto text-gray-600 mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">Không có ưu đãi</h3>
                                <p className="text-gray-400">Hiện tại không có chương trình khuyến mãi nào trong danh mục này</p>
                            </div>
                        </div>
                    )}
                </section>

                {/* CTA Section */}
                <section className="max-w-6xl mx-auto px-8 py-12">
                    <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Đăng Ký Nhận Ưu Đãi</h2>
                        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                            Đăng ký thành viên CineBook để nhận thông báo về các chương trình khuyến mãi mới nhất và ưu đãi độc quyền!
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                        >
                            <Gift className="w-5 h-5" />
                            Đăng Ký Ngay
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
