'use client';

import React, { useState, useEffect } from 'react';
import { personService } from '../../services/api';

const PersonList = () => {
    const [persons, setPersons] = useState([]);

    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const response = await personService.getAll();
                console.log('API Yanıtı:', response);
                setPersons(response.data.rows || []);
            } catch (err) {
                console.error('Hata:', err);
                setPersons([]);
            }
        };

        fetchPersons();
    }, []);

    return (
        <div className="p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Kişi Listesi</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Toplam {persons.length} kişi bulundu
                </p>
            </div>
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
                            </li>
                        ))
                    ) : (
                        <li className="p-3 text-gray-500 text-center">Yükleniyor...</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default PersonList; 