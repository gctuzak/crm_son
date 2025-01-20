import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { personService } from '../../services/personService';

const ActivityForm = () => {
    const navigate = useNavigate();
    // Form state
    const [formData, setFormData] = useState({
        status: 'pending', // yapılacak
        type: '',
        description: '',
        assignee: '',
        customer: '',
        quote: '',
        order: '',
    });

    // Müşteri listesi state
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock veriler
    const activityTypes = [
        { id: 1, name: 'Telefon görüşmesi' },
        { id: 2, name: 'E-posta gönderimi' },
        { id: 3, name: 'Yüz yüze görüşme' },
        { id: 4, name: 'Teklif hazırlama' },
        { id: 5, name: 'Sipariş takibi' },
        { id: 6, name: 'Şikayet yönetimi' },
        { id: 7, name: 'Ürün tanıtımı' },
        { id: 8, name: 'Fiyat görüşmesi' }
    ];

    // Müşterileri getir
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await personService.getAll();
                setCustomers(data);
            } catch (error) {
                console.error('Müşteriler yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form verileri:', formData);
        // API entegrasyonu sonra yapılacak
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Yeni aktivite veya görev</h2>
                        <button 
                            onClick={() => navigate('/activities')} 
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Son Durum */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Son Durum</label>
                            <div className="flex gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="pending"
                                        checked={formData.status === 'pending'}
                                        onChange={handleChange}
                                        className="text-orange-500"
                                    />
                                    <span className="ml-2">Yapılacak</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="done"
                                        checked={formData.status === 'done'}
                                        onChange={handleChange}
                                        className="text-orange-500"
                                    />
                                    <span className="ml-2">Yapıldı</span>
                                </label>
                            </div>
                        </div>

                        {/* Tür */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Tür</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Seçiniz</option>
                                {activityTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Açıklama */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        {/* Görevli */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Görevli</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="assignee"
                                    value={formData.assignee}
                                    onChange={handleChange}
                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Kullanıcı modülü eklenince güncellenecek"
                                    disabled
                                />
                                <button type="button" className="px-3 py-2 bg-gray-100 rounded-md">
                                    +
                                </button>
                            </div>
                        </div>

                        {/* İlişki/Müşteri */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">İlişki/Müşteri</label>
                            <select
                                name="customer"
                                value={formData.customer}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Seçiniz</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.first_name} {customer.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Teklif */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Teklif</label>
                            <input
                                type="text"
                                name="quote"
                                value={formData.quote}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Teklif modülü eklenince güncellenecek"
                                disabled
                            />
                        </div>

                        {/* Sipariş */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Sipariş</label>
                            <input
                                type="text"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Sipariş modülü eklenince güncellenecek"
                                disabled
                            />
                        </div>

                        {/* Dosyalar */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Dosyalar</label>
                            <button
                                type="button"
                                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
                            >
                                Yeni dosya/görsel ekle
                            </button>
                        </div>

                        {/* Butonlar */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/activities')}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                            >
                                Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ActivityForm; 