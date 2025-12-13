import { useState, useEffect } from "react"
import { Wallet as WalletIcon, TrendingUp, TrendingDown, Filter, Calendar } from "lucide-react"
import Header from "../../layouts/header"
import { walletApi } from "../../services/api"

export default function WalletPage() {
    const [balance, setBalance] = useState(0)
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filterType, setFilterType] = useState('all')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchWalletData()
    }, [filterType, page])

    const fetchWalletData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch balance and transactions in parallel
            const [walletData, txData] = await Promise.all([
                walletApi.getWallet(),
                walletApi.getTransactions(page, 10, filterType === 'all' ? null : filterType)
            ])

            console.log('💰 [Wallet] Wallet data:', walletData)
            console.log('📋 [Wallet] Transactions response:', txData)

            // Handle response structure
            const walletBalance = walletData?.data?.balance ?? walletData?.balance ?? 0

            // Handle both array response and object response
            let txList = []
            let pagination = { totalPages: 1 }

            if (Array.isArray(txData)) {
                // Direct array response
                txList = txData
            } else if (txData?.data) {
                // Object with data property
                txList = txData.data
                pagination = txData.pagination ?? { totalPages: 1 }
            }

            console.log('✅ [Wallet] Parsed balance:', walletBalance)
            console.log('✅ [Wallet] Parsed transactions:', txList)
            console.log('✅ [Wallet] Parsed pagination:', pagination)

            setBalance(walletBalance)
            setTransactions(txList)
            setTotalPages(pagination.totalPages)
        } catch (err) {
            console.error('❌ [Wallet] Error fetching data:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'refund':
            case 'deposit':
                return <TrendingUp className="w-5 h-5 text-green-500" />
            case 'payment':
            case 'withdrawal':
                return <TrendingDown className="w-5 h-5 text-red-500" />
            default:
                return <WalletIcon className="w-5 h-5 text-gray-500" />
        }
    }

    const getTransactionColor = (type) => {
        switch (type) {
            case 'refund':
            case 'deposit':
                return 'text-green-500'
            case 'payment':
            case 'withdrawal':
                return 'text-red-500'
            default:
                return 'text-gray-500'
        }
    }

    const formatAmount = (amount, type) => {
        const sign = ['refund', 'deposit'].includes(type) ? '+' : '-'
        return `${sign}${amount.toLocaleString('vi-VN')} ₫`
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getTypeLabel = (type) => {
        const labels = {
            refund: 'Hoàn tiền',
            deposit: 'Nạp tiền',
            payment: 'Thanh toán',
            withdrawal: 'Rút tiền'
        }
        return labels[type] || type
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Header />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Wallet Balance Card */}
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm mb-2">Số Dư Ví</p>
                            <h1 className="text-4xl font-bold text-white">
                                {balance.toLocaleString('vi-VN')} ₫
                            </h1>
                        </div>
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                            <WalletIcon className="w-12 h-12 text-white" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 text-gray-300">
                            <Filter className="w-5 h-5" />
                            <span className="font-medium">Lọc:</span>
                        </div>

                        {['all', 'refund', 'payment', 'deposit', 'withdrawal'].map((type) => (
                            <button
                                key={type}
                                onClick={() => {
                                    setFilterType(type)
                                    setPage(1)
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${filterType === type
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {type === 'all' ? 'Tất Cả' : getTypeLabel(type)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Transaction List */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Calendar className="w-6 h-6" />
                            Lịch Sử Giao Dịch
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-400 mt-4">Đang tải...</p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center">
                            <p className="text-red-400">❌ {error}</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="p-12 text-center">
                            <WalletIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">Chưa có giao dịch nào</p>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-gray-700">
                                {transactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="p-6 hover:bg-gray-700/30 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="bg-gray-700 p-3 rounded-full">
                                                    {getTransactionIcon(tx.type)}
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-white font-medium mb-1">
                                                        {getTypeLabel(tx.type)}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm">
                                                        {tx.description || 'Không có mô tả'}
                                                    </p>
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        {formatDate(tx.created_at)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className={`text-xl font-bold ${getTransactionColor(tx.type)}`}>
                                                    {formatAmount(tx.amount, tx.type)}
                                                </p>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    Số dư: {tx.balance_after.toLocaleString('vi-VN')} ₫
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="p-6 border-t border-gray-700 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                                    >
                                        Trước
                                    </button>

                                    <span className="text-gray-300 px-4">
                                        Trang {page} / {totalPages}
                                    </span>

                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
