'use client';

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PersonList from '../person/PersonList';
import CompanyList from '../company/CompanyList';

const CustomerList = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(() => {
        // URL'den aktif sekmeyi belirle
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get('tab') || 'persons';
    });

    // URL'yi güncelle
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('tab', activeTab);
        const newUrl = `${location.pathname}?${searchParams.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }, [activeTab, location]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="p-4">
            {/* Tab butonları */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => handleTabChange('persons')}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === 'persons'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Kişiler
                </button>
                <button
                    onClick={() => handleTabChange('companies')}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === 'companies'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Firmalar
                </button>
            </div>

            {/* Tab içeriği */}
            {activeTab === 'persons' ? (
                <PersonList />
            ) : (
                <CompanyList />
            )}
        </div>
    );
};

export default CustomerList; 