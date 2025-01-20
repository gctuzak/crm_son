'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { personService } from '../../services/personService';

const PersonList = () => {
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                }
            } catch (err) {
                console.error('Silme hatası:', err);
                setError(err.message || 'Kişi silinirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading && persons.length === 0) {
        return <div className="p-4 text-center">Yükleniyor...</div>;
    }

    return (
        <div className="p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Kişi Listesi</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Toplam {persons.length} kişi bulundu
                </p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Tablo Başlıkları */}
                <div className="bg-gray-50 p-3 border-b flex items-center">
                    <span className="font-semibold text-gray-700 w-24">ID</span>
                    <span className="font-semibold text-gray-700 w-48">İsim</span>
                    <span className="font-semibold text-gray-700 w-48">Soyisim</span>
                    <span className="font-semibold text-gray-700 w-48">TC Kimlik</span>
                    <span className="font-semibold text-gray-700 w-36">Telefon</span>
                    <span className="font-semibold text-gray-700 w-32">Tip</span>
                    <span className="font-semibold text-gray-700 w-32">Şehir</span>
                    <span className="font-semibold text-gray-700 w-48">Şirket</span>
                    <span className="font-semibold text-gray-700 w-32">İşlemler</span>
                </div>
                {/* Liste İçeriği */}
                <ul>
                    {persons && persons.length > 0 ? (
                        persons.map(person => (
                            <li key={person.id} className="p-3 border-b last:border-0 flex items-center hover:bg-gray-50">
                                <span className="text-gray-700 w-24">{person.id}</span>
                                <span className="text-gray-800 w-48">{person.first_name}</span>
                                <span className="text-gray-800 w-48">{person.last_name}</span>
                                <span className="text-gray-800 w-48">{person.identity_number}</span>
                                <span className="text-gray-800 w-36">{person.phone}</span>
                                <span className="text-gray-800 w-32">{person.type}</span>
                                <span className="text-gray-800 w-32">{person.city || '-'}</span>
                                <span className="text-gray-800 w-48">{person.company_name || '-'}</span>
                                <span className="flex gap-2 w-32">
                                    <button
                                        onClick={() => handleEdit(person.id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                                        disabled={loading}
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(person.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                                        disabled={loading}
                                    >
                                        Sil
                                    </button>
                                </span>
                            </li>
                        ))
                    ) : (
                        <li className="p-3 text-gray-500 text-center">Kayıt bulunamadı</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default PersonList; 