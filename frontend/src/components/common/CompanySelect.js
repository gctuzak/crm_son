'use client';

import React, { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';

const CompanySelect = ({ value, onChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Seçili şirketin adını göstermek için
    useEffect(() => {
        const fetchSelectedCompany = async () => {
            if (value) {
                const response = await companyService.getById(value);
                if (response.success && response.data) {
                    setSearchTerm(response.data.name);
                    setSelectedCompany(response.data);
                }
            }
        };
        fetchSelectedCompany();
    }, [value]);

    // Şirket arama
    useEffect(() => {
        const searchCompanies = async () => {
            if (!searchTerm || searchTerm.length < 2) {
                setCompanies([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await companyService.getAll();
                if (response.success) {
                    const filtered = response.data.filter(company =>
                        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        company.tax_number?.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    setCompanies(filtered);
                }
            } catch (error) {
                console.error('Şirket arama hatası:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(searchCompanies, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleCompanySelect = (company) => {
        setSearchTerm(company.name);
        setSelectedCompany(company);
        onChange(company.id);
        setShowDropdown(false);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (!value) {
            onChange('');
            setSelectedCompany(null);
        }
        setShowDropdown(true);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(true)}
                placeholder="Şirket ara..."
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            {isLoading && (
                <div className="absolute right-2 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
            )}

            {showDropdown && companies.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            onClick={() => handleCompanySelect(company)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <div className="font-medium">{company.name}</div>
                            {company.tax_number && (
                                <div className="text-sm text-gray-500">
                                    Vergi No: {company.tax_number}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanySelect; 