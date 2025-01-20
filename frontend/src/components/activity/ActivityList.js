import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityForm from './ActivityForm';

const ActivityList = () => {
    const navigate = useNavigate();
    // Örnek veriler
    const activities = [
        {
            id: 2620,
            title: 'TRİO LIGHTING',
            assignee: 'Büşra Onak',
            dueDate: 'Bu hafta (24 Ocak 2025)',
            lastUpdate: '2 gün önce (17 Ocak 2025) 16:49 Büşra Onak',
            status: 'Teklif Durum Takibi'
        },
        {
            id: 2607,
            title: 'KALYON İNŞAAT SANAYİ VE TİCARET AŞ.',
            assignee: 'Büşra Onak',
            dueDate: '3 gün önce (16 Ocak 2025)',
            lastUpdate: '4 gün önce (15 Ocak 2025) 17:48 Günay Çağrı Tuzak',
            status: 'Teklif Durum Takibi'
        },
        {
            id: 2619,
            title: 'Özgür Sayın',
            assignee: 'Büşra Onak',
            dueDate: 'Bu hafta (22 Ocak 2025)',
            lastUpdate: '4 gün önce (15 Ocak 2025) 14:55 Büşra Onak',
            status: 'Teklif Durum Takibi'
        }
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [totalRecords] = useState(3699);
    const [showForm, setShowForm] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Arama yapılıyor:', searchTerm);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">AKTİVİTE / GÖREV</h2>
                <button 
                    onClick={() => navigate('/activities/new')}
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

            {/* Aktivite Listesi */}
            <div className="space-y-3">
                {activities.map((activity) => (
                    <div 
                        key={activity.id} 
                        className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-red-500 text-2xl mt-1">⏰</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-orange-500 transition-colors duration-200">
                                            {activity.title} - {activity.id}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className="font-medium">Görevli:</span> {activity.assignee} 
                                            <span className="mx-2">•</span>
                                            <span className="font-medium">Son Tarih:</span> {activity.dueDate}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium">Son düzenleme:</span> {activity.lastUpdate}
                                        </p>
                                    </div>
                                    <span className="text-orange-500 font-medium text-sm whitespace-nowrap px-3 py-1 bg-orange-50 rounded-full">
                                        {activity.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form Modal */}
            {showForm && <ActivityForm onClose={() => setShowForm(false)} />}
        </div>
    );
};

export default ActivityList; 