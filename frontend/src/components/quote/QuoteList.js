import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuoteList = () => {
    const navigate = useNavigate();
    // Örnek veriler
    const quotes = [
        {
            id: 2620,
            company: 'TRİO LIGHTING',
            sendDate: '17/01/2025',
            quoteType: 'Eposta gönderildi',
            city: 'İstanbul',
            projectName: 'Viaport Gergi Tavan',
            amount: '4.085,64 EUR',
            payment: 'Peşin',
            assignee: 'Büşra Onak',
            lastUpdate: '2 gün önce (17 Ocak 2025) 16:49 Büşra Onak',
            status: 'Teklif verildi'
        },
        {
            id: 2619,
            company: 'Özgür Sayın',
            sendDate: '15/01/2025',
            quoteType: 'Eposta gönderildi',
            city: 'Ankara',
            projectName: 'Tunalı Hilmi- Mango Mağazası',
            amount: '5.315,52 EUR',
            payment: 'Peşin',
            assignee: 'Büşra Onak',
            lastUpdate: '4 gün önce (15 Ocak 2025) 14:55 Büşra Onak',
            status: 'Teklif verildi'
        },
        {
            id: 2618,
            company: 'Özlenir Group',
            sendDate: '14/01/2025',
            quoteType: 'Eposta gönderildi',
            city: 'İstanbul',
            district: 'Kadıköy',
            projectName: 'Akbatı Jeanslab Mağazası',
            amount: '382,98 EUR',
            payment: 'Peşin',
            systemDate: '15/01/2025',
            assignee: 'Büşra Onak',
            lastUpdate: '4 gün önce (15 Ocak 2025) 12:12 Büşra Onak',
            status: 'Teklif verildi'
        }
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [totalRecords] = useState(2554);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Arama yapılıyor:', searchTerm);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">TEKLİF</h2>
                <button 
                    onClick={() => navigate('/quotes/new')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
                >
                    Yeni Ekle
                </button>
            </div>

            {/* Arama ve Filtre */}
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Önce filtreyi seçin"
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 text-sm font-medium flex items-center"
                    >
                        Sırala
                    </button>
                </form>
            </div>

            {/* Kayıt Sayısı */}
            <div className="flex justify-between items-center mb-4 text-sm text-gray-600 border-b border-gray-100 pb-4">
                <span>Bulunan kayıt: {totalRecords}</span>
                <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium">
                    Listeyi sağda göster
                </button>
            </div>

            {/* Teklif Listesi */}
            <div className="space-y-3">
                {quotes.map((quote) => (
                    <div 
                        key={quote.id} 
                        className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-green-500 text-2xl mt-1">📄</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-orange-500 transition-colors duration-200">
                                            {quote.company} - {quote.id}
                                        </h3>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Gönderim Tarihi:</span> {quote.sendDate}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Teklif Şekli:</span> {quote.quoteType}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Uygulanacak Şehir:</span> {quote.city}
                                                {quote.district && <span> - {quote.district}</span>}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Proje Adı:</span> {quote.projectName}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Tutar:</span> {quote.amount}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Ödeme:</span> {quote.payment}
                                            </p>
                                            {quote.systemDate && (
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Sistem Kayıt Tarihi:</span> {quote.systemDate}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Görevli:</span> {quote.assignee}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                <span className="font-medium">Son düzenleme:</span> {quote.lastUpdate}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-green-500 font-medium text-sm whitespace-nowrap px-3 py-1 bg-green-50 rounded-full">
                                        {quote.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuoteList; 