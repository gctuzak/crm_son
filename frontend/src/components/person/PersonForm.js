'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { personService, companyService } from '../../services/api';

const PersonForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [companies, setCompanies] = useState([]);
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
        const fetchCompanies = async () => {
            try {
                const response = await companyService.getAll();
                setCompanies(response.data.rows || []);
            } catch (err) {
                console.error('Şirketler yüklenirken hata:', err);
                setCompanies([]);
            }
        };

        const fetchPerson = async () => {
            if (id) {
                try {
                    const response = await personService.getById(id);
                    setFormData(response.data);
                } catch (err) {
                    console.error('Kişi bilgileri yüklenirken hata:', err);
                }
            }
        };

        fetchCompanies();
        fetchPerson();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await personService.update(id, formData);
            } else {
                await personService.create(formData);
            }
            navigate('/persons');
        } catch (err) {
            console.error('Form gönderilirken hata:', err);
            alert('Kişi kaydedilirken bir hata oluştu.');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {id ? 'Kişi Düzenle' : 'Yeni Kişi Ekle'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">İsim</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Soyisim</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Telefon</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Şehir</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tip</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="employee">Çalışan</option>
                            <option value="customer">Müşteri</option>
                            <option value="supplier">Tedarikçi</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Şirket</label>
                        <select
                            name="company_id"
                            value={formData.company_id || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Şirket Seçin</option>
                            {Array.isArray(companies) && companies.map(company => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Adres</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/persons')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {id ? 'Güncelle' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PersonForm; 