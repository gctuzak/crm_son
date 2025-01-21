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
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Şirketler</h1>
                <button
                    onClick={() => navigate('/companies/new')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                    Yeni Şirket Ekle
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Şirket ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p className="font-medium">Hata</p>
                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Şirket Adı</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vergi No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Şehir</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCompanies.map((company) => (
                                    <tr key={company.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.tax_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {company.email && (
                                                <a href={`mailto:${company.email}`} className="text-blue-600 hover:text-blue-800">
                                                    {company.email}
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.city}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => navigate(`/companies/${company.id}/edit`)}
                                                className="text-orange-600 hover:text-orange-800 mr-4"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(company.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredCompanies.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500">
                            Gösterilecek şirket bulunamadı.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CompanyList; 