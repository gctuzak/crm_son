import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { personService } from '../../services/personService';
import { companyService } from '../../services/companyService';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [searchResults, setSearchResults] = useState({ persons: [], companies: [] });
    const [loading, setLoading] = useState(false);

    const menuItems = [
        { path: '/dashboard', icon: 'home', text: 'Ana Menü' },
        { path: '/customers', icon: 'people', text: 'Müşteriler' },
        { path: '/activities', icon: 'event_note', text: 'Aktivite / Görev' },
        { path: '/quotes', icon: 'description', text: 'Teklifler' },
        { path: '/orders', icon: 'shopping_cart', text: 'Siparişler' },
        { path: '/products', icon: 'inventory_2', text: 'Ürünler' },
        { path: '/files', icon: 'folder', text: 'Dosyalar' },
        { path: '/users', icon: 'person', text: 'Kullanıcılar' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.search-container')) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (value) => {
        setSearchTerm(value);
        if (!value.trim()) {
            setSearchResults({ persons: [], companies: [] });
            setShowResults(false);
            return;
        }

        setLoading(true);
        setShowResults(true);

        try {
            const [personsResponse, companiesResponse] = await Promise.all([
                personService.getAll(),
                companyService.getAll()
            ]);

            const searchTermLower = value.toLowerCase();

            const filteredPersons = personsResponse.success ? personsResponse.data.filter(person =>
                `${person.first_name} ${person.last_name}`.toLowerCase().includes(searchTermLower)
            ) : [];

            const filteredCompanies = companiesResponse.success ? companiesResponse.data.filter(company =>
                company.name.toLowerCase().includes(searchTermLower)
            ) : [];

            setSearchResults({
                persons: filteredPersons.slice(0, 5),
                companies: filteredCompanies.slice(0, 5)
            });
        } catch (error) {
            console.error('Arama hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResultClick = (item, type) => {
        setShowResults(false);
        setSearchTerm('');
        if (type === 'person') {
            navigate(`/customers?tab=persons&highlight=${item.id}`);
        } else {
            navigate(`/customers?tab=companies&highlight=${item.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Üst çubuk */}
            <div className="bg-[#2B579A] text-white border-b border-gray-200">
                <div className="flex justify-between items-center px-4 h-12">
                    <div className="flex items-center">
                        <img className="h-6" src="/logo.png" alt="ITEM" />
                        <div className="ml-4 relative search-container">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => setShowResults(true)}
                                placeholder="Kişi veya şirket ara..."
                                className="w-64 px-2 py-1 pr-8 text-black text-sm border rounded"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            {showResults && (searchResults.persons.length > 0 || searchResults.companies.length > 0) && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-auto">
                                    {loading ? (
                                        <div className="px-4 py-2 text-gray-500">Aranıyor...</div>
                                    ) : (
                                        <>
                                            {searchResults.persons.length > 0 && (
                                                <div className="border-b border-gray-200">
                                                    <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">
                                                        Kişiler
                                                    </div>
                                                    {searchResults.persons.map(person => (
                                                        <div
                                                            key={`person_${person.id}`}
                                                            onClick={() => handleResultClick(person, 'person')}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                                                        >
                                                            {person.first_name} {person.last_name}
                                                            {person.company_name && ` - ${person.company_name}`}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {searchResults.companies.length > 0 && (
                                                <div>
                                                    <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">
                                                        Şirketler
                                                    </div>
                                                    {searchResults.companies.map(company => (
                                                        <div
                                                            key={`company_${company.id}`}
                                                            onClick={() => handleResultClick(company, 'company')}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                                                        >
                                                            {company.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 mr-2">
                        <button className="hover:bg-[#3B67AA] p-1.5 rounded">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </button>
                        <button className="hover:bg-[#3B67AA] p-1.5 rounded">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <button className="hover:bg-[#3B67AA] p-1.5 rounded">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button className="hover:bg-[#3B67AA] p-1.5 rounded">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Ana içerik */}
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
                    <nav className="mt-4">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.text}
                                    to={item.path}
                                    className={`flex items-center px-4 py-2 mx-2 rounded-md text-sm ${
                                        isActive
                                            ? 'bg-orange-50 text-orange-500'
                                            : 'text-gray-900 hover:bg-orange-50 hover:text-orange-500'
                                    }`}
                                >
                                    <span className="material-icons text-xl mr-2">{item.icon}</span>
                                    {item.text}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* İçerik */}
                <div className="flex-1 p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout; 