import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [totalRecords] = useState(1617);

    // Mock veriler
    const orders = [
        {
            id: 2504,
            company: 'Emaar Libadiye Gayrimenkul Geliştirme A.Ş',
            assignee: 'Büşra Onak',
            date: '3 gün önce (16 Ocak 2024) 13:55',
            status: 'Sipariş alındı'
        },
        {
            id: 2503,
            company: 'SDL AYDINLATMA SAN.ve TİC.LTD.ŞTİ.',
            assignee: 'Büşra Onak',
            date: 'Geçen hafta (6 Ocak 2024) 16:39',
            status: 'Sipariş alındı'
        }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Arama yapılıyor:', searchTerm);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">SİPARİŞ</h2>
                <button 
                    onClick={() => navigate('/orders/new')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
                >
                    Yeni Ekle
                </button>
            </div>

            {/* Arama Formu */}
            <div className="mb-6">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Önce filtreyi seçin"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
            </div>

            {/* Kayıt Sayısı */}
            <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                <span>Bulunan kayıt: {totalRecords}</span>
                <button className="text-blue-600 hover:underline">Listeyi sağda göster</button>
            </div>

            {/* Sipariş Listesi */}
            <div className="space-y-3">
                {orders.map((order) => (
                    <div 
                        key={order.id}
                        className="flex items-center gap-3 border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white cursor-pointer"
                        onClick={() => navigate(`/orders/${order.id}`)}
                    >
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 text-lg">✓</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col">
                                <div className="flex items-baseline justify-between">
                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                        {order.company}
                                    </h3>
                                    <span className="text-sm text-orange-500 whitespace-nowrap ml-2">
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <span>{order.assignee}</span>
                                    </div>
                                    <span className="text-xs">{order.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderList; 