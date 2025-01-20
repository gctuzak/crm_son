import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { companyService } from '../../services/api';

const CompanyForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        type: 'corporate',
        tax_number: '',
        tax_office: '',
        address: '',
        phone: '',
        sector: '',
        city: '',
        representative_id: null,
        created_by: null
    });

    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            const fetchCompanyData = async () => {
                try {
                    const response = await companyService.getById(id);
                    console.log('Gelen şirket verisi:', response);
                    
                    if (response?.data) {
                        const data = response.data;
                        setFormData({
                            name: data.name || '',
                            type: data.type || 'corporate',
                            tax_number: data.tax_number || '',
                            tax_office: data.tax_office || '',
                            address: data.address || '',
                            phone: data.phone || '',
                            sector: data.sector || '',
                            city: data.city || '',
                            representative_id: data.representative_id || null,
                            created_by: data.created_by || null
                        });
                    } else {
                        throw new Error('Şirket bilgileri alınamadı');
                    }
                } catch (error) {
                    console.error('Şirket bilgileri yüklenirken hata:', error);
                    setError(error.message || 'Şirket bilgileri yüklenirken bir hata oluştu');
                } finally {
                    setLoading(false);
                }
            };
            fetchCompanyData();
        }
    }, [id, isEditMode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const submitData = {
                name: formData.name,
                type: formData.type,
                tax_number: formData.tax_number,
                tax_office: formData.tax_office,
                address: formData.address,
                phone: formData.phone,
                sector: formData.sector,
                city: formData.city,
                representative_id: formData.representative_id,
                created_by: formData.created_by
            };

            console.log('Gönderilecek veri:', submitData);

            if (isEditMode) {
                const response = await companyService.update(id, submitData);
                console.log('Güncelleme yanıtı:', response);
            } else {
                const response = await companyService.create(submitData);
                console.log('Oluşturma yanıtı:', response);
            }
            
            navigate('/persons');
        } catch (error) {
            console.error('Form gönderilirken hata:', error);
            setError(error.message || 'Form gönderilirken bir hata oluştu');
        }
    };

    if (loading) {
        return <div className="p-4">Yükleniyor...</div>;
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Hata</h3>
                            <div className="mt-2 text-sm text-red-700">{error}</div>
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/persons')}
                                    className="text-sm font-medium text-red-800 hover:underline"
                                >
                                    Listeye Dön
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {isEditMode ? 'Şirket Düzenle' : 'Yeni Şirket'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Adı</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Türü</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="corporate">Kurumsal</option>
                                <option value="individual">Bireysel</option>
                                <option value="limited">Limited</option>
                                <option value="incorporated">Anonim</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Numarası</label>
                            <input
                                type="text"
                                name="tax_number"
                                value={formData.tax_number}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Dairesi</label>
                            <input
                                type="text"
                                name="tax_office"
                                value={formData.tax_office}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sektör</label>
                            <input
                                type="text"
                                name="sector"
                                value={formData.sector}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">İlgili Kişi</label>
                            <input
                                type="text"
                                name="representative_id"
                                value={formData.representative_id}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Oluşturan</label>
                            <input
                                type="text"
                                name="created_by"
                                value={formData.created_by}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 border-t pt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/persons')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                    >
                        {isEditMode ? 'Güncelle' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyForm; 