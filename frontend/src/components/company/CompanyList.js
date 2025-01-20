import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../../services/companyService';

const CompanyList = ({ searchTerm }) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchCompanies = useCallback(async () => {
        try {
            setLoading(true);
            const response = await companyService.getAll();
            console.log('API Yanıtı:', response);
            if (Array.isArray(response)) {
                setCompanies(response);
            } else {
                setError('Şirketler yüklenirken bir hata oluştu: Geçersiz veri formatı');
            }
        } catch (err) {
            console.error('Şirketler yüklenirken hata:', err);
            setError(`Şirketler yüklenirken bir hata oluştu: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const handleDelete = async (id) => {
        if (window.confirm('Bu şirketi silmek istediğinizden emin misiniz?')) {
            try {
                await companyService.delete(id);
                await fetchCompanies();
            } catch (err) {
                console.error('Şirket silinirken hata:', err);
                setError(`Şirket silinirken bir hata oluştu: ${err.message}`);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md bg-red-50 p-4">
                <h3 className="text-sm font-medium text-red-800">Hata</h3>
                <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const filteredCompanies = companies.filter(company => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            company.name?.toLowerCase().includes(searchLower) ||
            company.tax_number?.toLowerCase().includes(searchLower) ||
            company.tax_office?.toLowerCase().includes(searchLower) ||
            company.phone?.toLowerCase().includes(searchLower) ||
            company.city?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Firma Adı</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vergi No</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vergi Dairesi</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Telefon</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Şehir</th>
                                <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                    <span className="sr-only">İşlemler</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCompanies.map((company) => (
                                <tr key={company.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                        {company.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{company.tax_number}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{company.tax_office}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{company.phone}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{company.city}</td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        <button
                                            onClick={() => navigate(`/companies/${company.id}/edit`)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => handleDelete(company.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompanyList; 