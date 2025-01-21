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
            navigate('/persons');
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">
                {id ? 'Kişi Düzenle' : 'Yeni Kişi Ekle'}
            </h1>

            {error && (
                <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* Sol Sütun */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ad</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Soyad</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">TC Kimlik No</label>
                            <input
                                type="text"
                                name="identity_number"
                                value={formData.identity_number}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">E-posta</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Telefon</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>
                    </div>

                    {/* Sağ Sütun */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Adres</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Şehir</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tip</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            >
                                <option value="employee">Çalışan</option>
                                <option value="customer">Müşteri</option>
                                <option value="supplier">Tedarikçi</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Şirket</label>
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
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PersonForm; 