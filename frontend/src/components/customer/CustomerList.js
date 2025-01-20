import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonList from '../person/PersonList';
import CompanyList from '../company/CompanyList';

const CustomerList = () => {
    const [activeTab, setActiveTab] = useState('person'); // 'person' veya 'company'
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Üst Bar */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Tab Butonları */}
                    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
                        <button
                            onClick={() => setActiveTab('person')}
                            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm ${
                                activeTab === 'person'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Kişiler
                        </button>
                        <button
                            onClick={() => setActiveTab('company')}
                            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm ${
                                activeTab === 'company'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Firmalar
                        </button>
                    </div>

                    {/* Arama Kutusu */}
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Ara..."
                            className="w-full rounded-lg border border-gray-300 p-2 pl-3 text-sm"
                        />
                        <span className="absolute inset-y-0 right-0 grid w-10 place-content-center">
                            <button type="button" className="text-gray-600 hover:text-gray-700">
                                <span className="sr-only">Ara</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="h-4 w-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                    />
                                </svg>
                            </button>
                        </span>
                    </div>

                    {/* Yeni Ekle Butonu */}
                    <button
                        onClick={() => navigate(activeTab === 'person' ? '/persons/new' : '/companies/new')}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                    >
                        {activeTab === 'person' ? 'Yeni Kişi Ekle' : 'Yeni Firma Ekle'}
                    </button>
                </div>
            </div>

            {/* Liste */}
            {activeTab === 'person' ? (
                <PersonList searchTerm={searchTerm} />
            ) : (
                <CompanyList searchTerm={searchTerm} />
            )}
        </div>
    );
};

export default CustomerList; 