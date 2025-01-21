import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { personService } from '../../services/personService';
import { companyService } from '../../services/companyService';

const ActivityForm = () => {
    const navigate = useNavigate();
    // Form state
    const [formData, setFormData] = useState({
        status: 'pending', // yapılacak
        type: '',
        description: '',
        assignee: '',
        customer: '',
        quote: '',
        order: '',
    });

    // Müşteri ve şirket listesi state
    const [customers, setCustomers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showCustomerList, setShowCustomerList] = useState(false);

    // Mock veriler
    const activityTypes = [
        { id: 1, name: 'Cari Hesap Bilgileri' },
        { id: 2, name: 'Fatura kesilecek' },
        { id: 3, name: 'Gelen eposta' },
        { id: 4, name: 'Giden eposta' },
        { id: 5, name: 'İmalat' },
        { id: 6, name: 'İşemri oluşturulacak' },
        { id: 7, name: 'Keşif' },
        { id: 8, name: 'Montaj' },
        { id: 9, name: 'Müşteri ziyaret' },
        { id: 10, name: 'Numune gönderimi' },
        { id: 11, name: 'Prim Hakedişi' },
        { id: 12, name: 'Proje çizim' },
        { id: 13, name: 'Proje İnceleme' },
        { id: 14, name: 'Sevkiyat' },
        { id: 15, name: 'Şikayet/Arıza/Servis kaydı' },
        { id: 16, name: 'Tahsilat Takibi' },
        { id: 17, name: 'Teklif Durum Takibi' },
        { id: 18, name: 'Teklif Gönderim Onayı' },
        { id: 19, name: 'Teklif Onay Talebi' },
        { id: 20, name: 'Teklif verilecek' },
        { id: 21, name: 'Teknik Servis' },
        { id: 22, name: 'Telefon görüşmesi' },
        { id: 23, name: 'Toplantı' },
        { id: 24, name: 'Toplu eposta' }
    ];

    // Verileri getir
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customersResponse, companiesResponse] = await Promise.all([
                    personService.getAll(),
                    companyService.getAll()
                ]);

                console.log('Müşteriler yanıtı:', customersResponse);
                console.log('Şirketler yanıtı:', companiesResponse);

                if (customersResponse.success && Array.isArray(customersResponse.data)) {
                    setCustomers(customersResponse.data);
                }

                if (companiesResponse.success && Array.isArray(companiesResponse.data)) {
                    console.log('Şirketler verisi:', companiesResponse.data);
                    setCompanies(companiesResponse.data);
                }
            } catch (error) {
                console.error('Veriler yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCustomerSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowCustomerList(true);
        if (!value) {
            setSelectedCustomer(null);
            setFormData(prev => ({ ...prev, customer: '' }));
        }
    };

    const handleCustomerSelect = (item, type) => {
        if (type === 'person') {
            setSelectedCustomer(item);
            setSearchTerm(`${item.first_name} ${item.last_name}${item.company_name ? ` - ${item.company_name}` : ''}`);
            setFormData(prev => ({ ...prev, customer: item.id }));
        } else {
            setSelectedCustomer({ company_id: item.id });
            setSearchTerm(item.name);
            setFormData(prev => ({ ...prev, customer: `company_${item.id}` }));
        }
        setShowCustomerList(false);
    };

    const getFilteredResults = () => {
        const searchTermLower = searchTerm.toLowerCase();
        
        // Kişileri sadece isimleri üzerinden ara
        const filteredPersons = customers.filter(customer => {
            const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
            return fullName.includes(searchTermLower);
        });

        // Şirketleri sadece şirket adı üzerinden ara
        const filteredCompanies = companies.filter(company => 
            (company?.name || '').toLowerCase().includes(searchTermLower)
        );

        return {
            persons: filteredPersons,
            companies: filteredCompanies
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form verileri:', formData);
        // API entegrasyonu sonra yapılacak
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Yeni aktivite veya görev</h2>
                        <button 
                            onClick={() => navigate('/activities')} 
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Son Durum */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Son Durum</label>
                            <div className="flex gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="pending"
                                        checked={formData.status === 'pending'}
                                        onChange={handleChange}
                                        className="text-orange-500"
                                    />
                                    <span className="ml-2">Yapılacak</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="done"
                                        checked={formData.status === 'done'}
                                        onChange={handleChange}
                                        className="text-orange-500"
                                    />
                                    <span className="ml-2">Yapıldı</span>
                                </label>
                            </div>
                        </div>

                        {/* Tür */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Tür</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Seçiniz</option>
                                {activityTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Açıklama */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        {/* Görevli */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Görevli</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="assignee"
                                    value={formData.assignee}
                                    onChange={handleChange}
                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Kullanıcı modülü eklenince güncellenecek"
                                    disabled
                                />
                                <button type="button" className="px-3 py-2 bg-gray-100 rounded-md">
                                    +
                                </button>
                            </div>
                        </div>

                        {/* İlişki/Müşteri */}
                        <div className="space-y-2 relative">
                            <label className="block text-sm font-medium text-gray-700">İlişki/Müşteri</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleCustomerSearch}
                                onFocus={() => setShowCustomerList(true)}
                                placeholder="Müşteri ara..."
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            {showCustomerList && searchTerm && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                    {(() => {
                                        const { persons, companies } = getFilteredResults();
                                        
                                        if (persons.length === 0 && companies.length === 0) {
                                            return <div className="px-4 py-2 text-gray-500">Sonuç bulunamadı</div>;
                                        }

                                        return (
                                            <>
                                                {persons.length > 0 && (
                                                    <div className="border-b border-gray-200">
                                                        <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">
                                                            Kişiler
                                                        </div>
                                                        {persons.map(person => (
                                                            <div
                                                                key={`person_${person.id}`}
                                                                onClick={() => handleCustomerSelect(person, 'person')}
                                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            >
                                                                {person.first_name} {person.last_name}
                                                                {person.company_name && ` - ${person.company_name}`}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                {companies.length > 0 && (
                                                    <div>
                                                        <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">
                                                            Şirketler
                                                        </div>
                                                        {companies.map(company => (
                                                            <div
                                                                key={`company_${company.id}`}
                                                                onClick={() => handleCustomerSelect(company, 'company')}
                                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            >
                                                                {company.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>

                        {/* Teklif */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Teklif</label>
                            <input
                                type="text"
                                name="quote"
                                value={formData.quote}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Teklif modülü eklenince güncellenecek"
                                disabled
                            />
                        </div>

                        {/* Sipariş */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Sipariş</label>
                            <input
                                type="text"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Sipariş modülü eklenince güncellenecek"
                                disabled
                            />
                        </div>

                        {/* Dosyalar */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Dosyalar</label>
                            <button
                                type="button"
                                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
                            >
                                Yeni dosya/görsel ekle
                            </button>
                        </div>

                        {/* Butonlar */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/activities')}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                            >
                                Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ActivityForm; 