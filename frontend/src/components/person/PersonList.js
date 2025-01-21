'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { personService } from '../../services/personService';
import PersonCard from './PersonCard';

const PersonList = () => {
    const [persons, setPersons] = useState([]);
    const [filteredPersons, setFilteredPersons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPersons = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await personService.getAll();
                console.log('Kişiler yanıtı:', response);
                
                if (response.success) {
                    setPersons(response.data || []);
                    setFilteredPersons(response.data || []);
                } else {
                    setError(response.error || 'Kişiler alınamadı');
                }
            } catch (err) {
                console.error('Kişiler yüklenirken hata:', err);
                setError('Kişiler yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchPersons();
    }, []);

    useEffect(() => {
        const filtered = persons.filter(person => 
            person.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.identity_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPersons(filtered);
    }, [searchTerm, persons]);

    const handleEdit = (id) => {
        navigate(`/persons/${id}/edit`);
    };

    const handleDelete = async (id) => {
        if (!id) {
            setError('Geçersiz kişi ID');
            return;
        }

        if (window.confirm('Bu kişiyi silmek istediğinizden emin misiniz?')) {
            try {
                setLoading(true);
                setError(null);

                await personService.delete(id);
                
                // Silme başarılı olduktan sonra listeyi yenile
                const response = await personService.getAll();
                if (response.success) {
                    setPersons(response.data || []);
                    setFilteredPersons(response.data || []);
                }
            } catch (err) {
                console.error('Silme hatası:', err);
                setError(err.message || 'Kişi silinirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePersonClick = (person) => {
        setSelectedPerson(person);
    };

    const handleCloseCard = () => {
        setSelectedPerson(null);
    };

    if (loading && persons.length === 0) {
        return <div className="p-4 text-center">Yükleniyor...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Kişiler</h1>
                <button
                    onClick={() => navigate('/persons/new')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                    Yeni Kişi Ekle
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Kişi ara..."
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
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ad Soyad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Şirket
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    E-posta
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Telefon
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPersons.map((person) => (
                                <tr key={person.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handlePersonClick(person)}
                                            className="text-sm font-medium text-gray-900 hover:text-orange-600"
                                        >
                                            {person.first_name} {person.last_name}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{person.company_name || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {person.email ? (
                                            <a
                                                href={`mailto:${person.email}`}
                                                className="text-sm text-blue-600 hover:text-blue-900"
                                            >
                                                {person.email}
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{person.phone || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Link
                                            to={`/persons/${person.id}/edit`}
                                            className="text-orange-600 hover:text-orange-900"
                                        >
                                            Düzenle
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(person.id)}
                                            className="text-red-600 hover:text-red-900 ml-2"
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

            <PersonCard
                person={selectedPerson}
                isOpen={!!selectedPerson}
                onClose={handleCloseCard}
            />
        </div>
    );
};

export default PersonList; 