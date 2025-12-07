// Vietnamese translations for the cinema booking application
export const translations = {
    // Header Navigation
    nav: {
        home: "Trang Chủ",
        movies: "Phim",
        showtimes: "Lịch Chiếu",
        promotions: "Ưu Đãi",
        support: "Hỗ Trợ Khách Hàng",
        contact: "Liên Hệ",
        member: "Thành Viên",
        login: "Đăng Nhập",
        register: "Đăng Ký",
        logout: "Đăng Xuất",
        profile: "Hồ Sơ",
        myTickets: "Vé Của Tôi",
        admin: "Quản Trị",
    },

    // Common
    common: {
        search: "Tìm kiếm...",
        getStarted: "Bắt Đầu",
        bookNow: "Đặt Vé Ngay",
        viewDetails: "Xem Chi Tiết",
        cancel: "Hủy",
        confirm: "Xác Nhận",
        save: "Lưu",
        edit: "Chỉnh Sửa",
        delete: "Xóa",
        back: "Quay Lại",
        next: "Tiếp Theo",
        previous: "Trước",
        loading: "Đang tải...",
        error: "Lỗi",
        success: "Thành công",
    },

    // Home Page
    home: {
        title: "Phim Đang Chiếu",
        subtitle: "Khám phá và đặt vé các bộ phim bom tấn mới nhất",
        searchPlaceholder: "Tìm kiếm phim...",
        filterAll: "Tất Cả",
        filterAction: "Hành Động",
        filterComedy: "Hài Kịch",
        filterSciFi: "Khoa Học Viễn Tưởng",
        filterDrama: "Chính Kịch",
    },

    // Movie Detail
    movieDetail: {
        backToMovies: "← Quay lại Danh Sách Phim",
        rating: "Đánh Giá",
        duration: "Thời Lượng",
        genre: "Thể Loại",
        director: "Đạo Diễn",
        cast: "Diễn Viên",
        language: "Ngôn Ngữ",
        subtitles: "Phụ Đề",
        releaseDate: "Ngày Phát Hành",
        selectShowtime: "Chọn Suất Chiếu",
        continueToBooking: "Tiếp Tục Đặt Vé →",
        minutes: "phút",
    },

    // Booking
    booking: {
        title: "Chọn Ghế Của Bạn",
        summary: "Tóm Tắt Đặt Vé",
        movie: "Phim",
        dateTime: "Ngày & Giờ",
        hall: "Phòng Chiếu",
        seats: "Ghế",
        none: "Chưa chọn",
        subtotal: "Tạm Tính",
        serviceFee: "Phí Dịch Vụ",
        total: "Tổng Cộng",
        proceedToPayment: "Tiến Hành Thanh Toán",
        selectSeatsNote: "Chọn ghế để tiếp tục",
        available: "Còn Trống",
        selected: "Đã Chọn",
        sold: "Đã Bán",
        locked: "Đang Giữ",
    },

    // Payment
    payment: {
        title: "Thanh Toán",
        cardNumber: "Số Thẻ",
        cardHolder: "Tên Chủ Thẻ",
        expiryDate: "Ngày Hết Hạn",
        cvv: "CVV",
        paymentMethod: "Phương Thức Thanh Toán",
        creditCard: "Thẻ Tín Dụng",
        debitCard: "Thẻ Ghi Nợ",
        eWallet: "Ví Điện Tử",
        completePayment: "Hoàn Tất Thanh Toán",
    },

    // My Tickets
    myTickets: {
        title: "Vé Của Tôi",
        noTickets: "Bạn chưa có vé nào",
        bookingCode: "Mã Đặt Vé",
        showTime: "Suất Chiếu",
        seat: "Ghế",
        status: "Trạng Thái",
        confirmed: "Đã Xác Nhận",
        pending: "Đang Chờ",
        cancelled: "Đã Hủy",
    },

    // Login
    login: {
        title: "Đăng Nhập",
        subtitle: "Chào mừng trở lại!",
        email: "Email",
        password: "Mật Khẩu",
        rememberMe: "Ghi Nhớ Đăng Nhập",
        forgotPassword: "Quên Mật Khẩu?",
        loginButton: "Đăng Nhập",
        noAccount: "Chưa có tài khoản?",
        signUp: "Đăng ký ngay",
        invalidCredentials: "Email hoặc mật khẩu không đúng",
    },

    // Register
    register: {
        title: "Đăng Ký",
        subtitle: "Tạo tài khoản mới",
        fullName: "Họ và Tên",
        email: "Email",
        password: "Mật Khẩu",
        confirmPassword: "Xác Nhận Mật Khẩu",
        phone: "Số Điện Thoại",
        registerButton: "Đăng Ký",
        haveAccount: "Đã có tài khoản?",
        signIn: "Đăng nhập ngay",
        passwordMismatch: "Mật khẩu không khớp",
    },

    // Admin
    admin: {
        dashboard: "Bảng Điều Khiển",
        movies: "Quản Lý Phim",
        showtimes: "Quản Lý Suất Chiếu",
        bookings: "Quản Lý Đặt Vé",
        users: "Quản Lý Người Dùng",
        reports: "Báo Cáo",
        settings: "Cài Đặt",
        addMovie: "Thêm Phim Mới",
        editMovie: "Chỉnh Sửa Phim",
        deleteMovie: "Xóa Phim",
        totalRevenue: "Tổng Doanh Thu",
        totalBookings: "Tổng Số Đặt Vé",
        totalUsers: "Tổng Người Dùng",
        activeMovies: "Phim Đang Chiếu",
    },

    // Validation Messages
    validation: {
        required: "Trường này là bắt buộc",
        invalidEmail: "Email không hợp lệ",
        minLength: "Tối thiểu {min} ký tự",
        maxLength: "Tối đa {max} ký tự",
        passwordStrength: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số",
    },

    // Error Messages
    errors: {
        networkError: "Lỗi kết nối mạng. Vui lòng thử lại.",
        serverError: "Lỗi máy chủ. Vui lòng thử lại sau.",
        notFound: "Không tìm thấy trang",
        unauthorized: "Bạn không có quyền truy cập",
        sessionExpired: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
    },
}

export default translations
