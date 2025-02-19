import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { companyService } from '../../services/companyService';

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
        email: '',
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
                            email: data.email || '',
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
            const submitData = Object.entries(formData).reduce((acc, [key, value]) => {
                if (value === '') {
                    acc[key] = null;
                }
                else if (['representative_id', 'created_by'].includes(key)) {
                    acc[key] = value ? Number(value) : null;
                }
                else {
                    acc[key] = value;
                }
                return acc;
            }, {});

            console.log('Gönderilecek veri:', submitData);

            let response;
            if (isEditMode) {
                response = await companyService.update(id, submitData);
                console.log('Güncelleme yanıtı:', response);
                if (response.success) {
                    navigate('/customers?tab=companies');
                } else {
                    throw new Error(response.error || 'Güncelleme başarısız oldu');
                }
            } else {
                response = await companyService.create(submitData);
                console.log('Oluşturma yanıtı:', response);
                if (response.success) {
                    navigate('/customers?tab=companies');
                } else {
                    throw new Error(response.error || 'Kayıt oluşturulamadı');
                }
            }
        } catch (error) {
            console.error('Form gönderilirken hata:', error);
            setError(error.message || 'Form gönderilirken bir hata oluştu');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
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
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    {isEditMode ? 'Şirket Düzenle' : 'Yeni Şirket'}
                </h2>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        <p className="font-medium">Hata</p>
                        <p>{error}</p>
                    </div>
                )}

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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Türü</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Dairesi</label>
                                <input
                                    type="text"
                                    name="tax_office"
                                    value={formData.tax_office}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sektör</label>
                                <input
                                    type="text"
                                    name="sector"
                                    value={formData.sector}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">İlgili Kişi</label>
                                <input
                                    type="text"
                                    name="representative_id"
                                    value={formData.representative_id}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Oluşturan</label>
                                <input
                                    type="text"
                                    name="created_by"
                                    value={formData.created_by}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/customers?tab=companies')}
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
        </div>
    );
};

export default CompanyForm; 