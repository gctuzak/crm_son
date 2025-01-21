'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { personService } from '../../services/personService';
import CompanySelect from '../common/CompanySelect';

const PersonForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        identity_number: '',
        email: '',
        phone: '',
        address: '',
        type: 'employee',
        city: '',
        company_id: ''
    });

    useEffect(() => {
        const fetchPerson = async () => {
            if (id) {
                setLoading(true);
                setError(null);
                try {
                    console.log('Kişi detayı yükleniyor... ID:', id);
                    const response = await personService.getById(id);
                    console.log('Kişi detayı yanıtı:', response);

                    if (response.success && response.data) {
                        setFormData(response.data);
                    } else {
                        setError(response.message || 'Kişi bulunamadı');
                        console.error('Kişi bulunamadı:', response);
                    }
                } catch (err) {
                    console.error('Kişi detayı yüklenirken hata:', err);
                    setError(err.message || 'Kişi detayı yüklenirken bir hata oluştu');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPerson();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCompanyChange = (companyId) => {
        setFormData(prev => ({
            ...prev,
            company_id: companyId
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (id) {
                console.log('Kişi güncelleniyor:', { id, formData });
                await personService.update(id, formData);
            } else {
                console.log('Yeni kişi oluşturuluyor:', formData);
                await personService.create(formData);
            }
            navigate('/customers?tab=persons');
        } catch (err) {
            console.error('Form gönderilirken hata:', err);
            setError(err.message || 'İşlem sırasında bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    {id ? 'Kişi Düzenle' : 'Yeni Kişi'}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
                                <input
                                    type="text"
                                    name="identity_number"
                                    value={formData.identity_number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tip</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="employee">Çalışan</option>
                                    <option value="customer">Müşteri</option>
                                    <option value="supplier">Tedarikçi</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Şirket</label>
                                <CompanySelect
                                    value={formData.company_id}
                                    onChange={handleCompanyChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/customers?tab=persons')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PersonForm; 