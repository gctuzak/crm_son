'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../../services/companyService';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await companyService.getAll();
            console.log('Şirketler yanıtı:', response);
            
            if (response.success) {
                setCompanies(Array.isArray(response.data) ? response.data : []);
                setFilteredCompanies(Array.isArray(response.data) ? response.data : []);
            } else {
                setCompanies([]);
                setFilteredCompanies([]);
                setError(response.error || 'Şirketler yüklenirken bir hata oluştu');
            }
        } catch (err) {
            console.error('Şirketler yüklenirken hata:', err);
            setCompanies([]);
            setFilteredCompanies([]);
            setError(err.message || 'Şirketler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        const filtered = companies.filter(company => 
            company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.tax_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCompanies(filtered);
    }, [searchTerm, companies]);

    const handleDelete = async (id) => {
        if (window.confirm('Bu şirketi silmek istediğinizden emin misiniz?')) {
            try {
                const response = await companyService.delete(id);
                if (response.success) {
                    await fetchCompanies(); // Listeyi yenile
                } else {
                    alert(response.message || 'Şirket silinemedi');
                }
            } catch (error) {
                console.error('Silme hatası:', error);
                alert(error.message || 'Şirket silinirken bir hata oluştu');
            }
        }
    };

    if (loading) {
        return <div className="text-center p-4">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (!Array.isArray(companies)) {
        console.error('Companies verisi dizi değil:', companies);
        return <div className="text-center text-red-500 p-4">Veri formatı hatası</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Şirket Listesi</h2>
                <button
                    onClick={() => navigate('/companies/new')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Yeni Şirket Ekle
                </button>
            </div>

            {/* Arama Kutusu */}
            <div className="p-4 border-b">
                <input
                    type="text"
                    placeholder="Şirket adı, vergi no, telefon veya e-posta ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
            </div>

            {filteredCompanies.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                    {loading ? 'Yükleniyor...' : 'Kayıt bulunamadı'}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Şirket Adı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vergi No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Telefon
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    E-posta
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCompanies.map((company) => (
                                <tr key={company.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {company.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {company.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {company.tax_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {company.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {company.email ? (
                                            <a
                                                href={`mailto:${company.email}`}
                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                                title="E-posta gönder"
                                            >
                                                {company.email}
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <button
                                            onClick={() => navigate(`/companies/${company.id}/edit`)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => handleDelete(company.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CompanyList; 