import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

interface Company {
    id: number;
    name: string;
}

interface CompanySelectProps {
    value?: number;
    onChange: (companyId: number | null) => void;
}

export function CompanySelect({ value, onChange }: CompanySelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm] = useDebounce(searchTerm, 300);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Şirket arama
    useEffect(() => {
        const searchCompanies = async () => {
            if (debouncedTerm.length < 2) {
                setCompanies([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/companies/search?term=${encodeURIComponent(debouncedTerm)}`);
                if (!response.ok) throw new Error('Şirket araması başarısız');
                const data = await response.json();
                setCompanies(data);
            } catch (error) {
                console.error('Şirket arama hatası:', error);
            } finally {
                setIsLoading(false);
            }
        };

        searchCompanies();
    }, [debouncedTerm]);

    // Seçili şirket değiştiğinde
    const handleCompanySelect = (company: Company | null) => {
        setSelectedCompany(company);
        onChange(company?.id || null);
        setSearchTerm(company?.name || '');
        setCompanies([]); // Seçim yapıldıktan sonra listeyi temizle
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Şirket ara..."
                className="w-full p-2 border rounded"
            />
            
            {isLoading && (
                <div className="absolute right-2 top-2">
                    <span>Aranıyor...</span>
                </div>
            )}

            {companies.length > 0 && (
                <div className="absolute w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            onClick={() => handleCompanySelect(company)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {company.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 