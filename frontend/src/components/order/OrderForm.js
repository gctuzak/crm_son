import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customer: '',
        orderNumber: '2505',
        relatedPerson: '',
        assignee: 'Günay Çağrı Tuzak',
        status: '',
        quote: '',
        deliveryDate: '',
        deliveryAddress: '',
        notes: '',
        files: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            files: [...prev.files, ...files]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form gönderiliyor:', formData);
        navigate('/orders');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Yeni Sipariş</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Sol Kolon */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri</label>
                                <input
                                    type="text"
                                    name="customer"
                                    value={formData.customer}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">İlgili</label>
                                <input
                                    type="text"
                                    name="relatedPerson"
                                    value={formData.relatedPerson}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Son Durum</label>
                                <input
                                    type="text"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teslimat Tarihi</label>
                                <input
                                    type="date"
                                    name="deliveryDate"
                                    value={formData.deliveryDate}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teslimat Adresi</label>
                                <textarea
                                    name="deliveryAddress"
                                    value={formData.deliveryAddress}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>

                        {/* Sağ Kolon */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sipariş Adı/No</label>
                                <input
                                    type="text"
                                    name="orderNumber"
                                    value={formData.orderNumber}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sorumlusu</label>
                                <input
                                    type="text"
                                    name="assignee"
                                    value={formData.assignee}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teklif</label>
                                <input
                                    type="text"
                                    name="quote"
                                    value={formData.quote}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dosyalar/Görseller</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Butonları */}
                    <div className="flex items-center space-x-3 border-t pt-6">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            Sayfa Sihirbazı
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200"
                        >
                            Siparişe Ürün Ekle
                        </button>
                        <div className="flex-1" />
                        <button
                            type="button"
                            onClick={() => navigate('/orders')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderForm; 