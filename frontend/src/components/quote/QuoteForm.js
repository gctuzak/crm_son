import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuoteForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company: '',
        customer: '',
        quoteNumber: '2621', // Otomatik oluşturulacak
        assignee: '',
        status: '',
        sendDate: '',
        quoteType: '',
        city: '',
        projectName: '',
        amount: '',
        currency: 'TL',
        paymentType: '',
        notes: '',
        systemDate: new Date().toISOString().split('T')[0],
    });

    const [showProductForm, setShowProductForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({
        code: '',
        quantity: 1,
        unit: 'm²',
        price: '',
        discount: 0,
        total: 0
    });

    const [companies, setCompanies] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [files, setFiles] = useState([]);

    // Mock veriler (daha sonra API'den gelecek)
    const quoteTypes = [
        { id: 1, name: 'E-posta' },
        { id: 2, name: 'WhatsApp' },
        { id: 3, name: 'Telefon' },
        { id: 4, name: 'Yüz yüze' }
    ];

    const quoteStatuses = [
        { id: 1, name: 'Teklif verildi' },
        { id: 2, name: 'Görüşülüyor' },
        { id: 3, name: 'Onaylandı' },
        { id: 4, name: 'Reddedildi' }
    ];

    const currencies = ['TL', 'USD', 'EUR'];

    // Mock ürün listesi
    const productList = [
        { code: 'GT.TD.USC.01', name: 'USC Translucent 0,22mm Gergi Tavan', unit: 'm²', price: '40 EUR' },
        { code: 'GT.TD.USC.02', name: 'USC Translucent 0,22mm Gergi Tavan', unit: 'm', price: '30 EUR' },
        { code: 'GT.TB.USC.01', name: 'USC Translucent Baskılı 0,22mm Gergi Tavan', unit: 'm²', price: '50 EUR' },
        { code: 'GT.TB.USC.02', name: 'USC Translucent Baskılı 0,22mm Gergi Tavan', unit: 'm', price: '40 EUR' }
    ];

    useEffect(() => {
        // Şirketleri getir
        const fetchCompanies = async () => {
            try {
                // const response = await companyService.getAll();
                // setCompanies(response.data);
                setCompanies([
                    { id: 1, name: 'ABC Şirketi' },
                    { id: 2, name: 'XYZ Ltd.' }
                ]);
            } catch (error) {
                console.error('Şirketler yüklenirken hata:', error);
            }
        };

        // Müşterileri getir
        const fetchCustomers = async () => {
            try {
                // const response = await customerService.getAll();
                // setCustomers(response.data);
                setCustomers([
                    { id: 1, name: 'Ahmet Yılmaz' },
                    { id: 2, name: 'Mehmet Demir' }
                ]);
            } catch (error) {
                console.error('Müşteriler yüklenirken hata:', error);
            }
        };

        fetchCompanies();
        fetchCustomers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...newFiles]);
    };

    const handleProductSelect = (code) => {
        const product = productList.find(p => p.code === code);
        if (product) {
            setSelectedProduct(prev => ({
                ...prev,
                code: product.code,
                price: parseInt(product.price),
                unit: product.unit
            }));
        }
    };

    const handleQuantityChange = (value) => {
        const quantity = parseFloat(value) || 0;
        setSelectedProduct(prev => ({
            ...prev,
            quantity,
            total: quantity * prev.price * (1 - prev.discount / 100)
        }));
    };

    const handleDiscountChange = (value) => {
        const discount = parseFloat(value) || 0;
        setSelectedProduct(prev => ({
            ...prev,
            discount,
            total: prev.quantity * prev.price * (1 - discount / 100)
        }));
    };

    const handleAddProduct = () => {
        if (selectedProduct.code && selectedProduct.quantity > 0) {
            const product = productList.find(p => p.code === selectedProduct.code);
            setProducts(prev => [...prev, {
                ...selectedProduct,
                name: product.name
            }]);
            setSelectedProduct({
                code: '',
                quantity: 1,
                unit: 'm²',
                price: '',
                discount: 0,
                total: 0
            });
        }
    };

    const handleRemoveProduct = (index) => {
        setProducts(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // API çağrısı yapılacak
            console.log('Form gönderiliyor:', formData);
            console.log('Dosyalar:', files);
            navigate('/quotes');
        } catch (error) {
            console.error('Form gönderilirken hata:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">YENİ TEKLİF</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    {/* Sol Kolon */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri</label>
                            <select
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Seçiniz</option>
                                {companies.map(company => (
                                    <option key={company.id} value={company.id}>{company.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">İlgili</label>
                            <select
                                name="customer"
                                value={formData.customer}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Seçiniz</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teklif Adı/No</label>
                            <input
                                type="text"
                                name="quoteNumber"
                                value={formData.quoteNumber}
                                readOnly
                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sorumlusu</label>
                            <input
                                type="text"
                                name="assignee"
                                value={formData.assignee}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Daha sonra kullanıcılar modülünden seçilecek"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Son Durum</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Seçiniz</option>
                                {quoteStatuses.map(status => (
                                    <option key={status.id} value={status.id}>{status.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gönderim Tarihi</label>
                            <input
                                type="date"
                                name="sendDate"
                                value={formData.sendDate}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teklif Şekli</label>
                            <select
                                name="quoteType"
                                value={formData.quoteType}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Seçiniz</option>
                                {quoteTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sağ Kolon */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Uygulanacak Şehir</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Proje Adı</label>
                            <input
                                type="text"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tutar</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    {currencies.map(currency => (
                                        <option key={currency} value={currency}>{currency}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dosyalar/Görseller</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full"
                                />
                                {files.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {files.map((file, index) => (
                                            <div key={index} className="text-sm text-gray-600">
                                                {file.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sistem Kayıt Tarihi</label>
                            <input
                                type="date"
                                name="systemDate"
                                value={formData.systemDate}
                                readOnly
                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                {/* Ürün/Hizmet Ekleme Butonu */}
                <div className="mt-8">
                    <button
                        type="button"
                        onClick={() => setShowProductForm(true)}
                        className="w-full bg-orange-100 text-orange-600 px-4 py-3 rounded-md hover:bg-orange-200 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">+</span> Ürün/Hizmet Ekle
                    </button>
                </div>

                {/* Ürün/Hizmet Ekleme Formu */}
                {showProductForm && (
                    <div className="mt-4 border rounded-lg p-4">
                        <div className="grid grid-cols-6 gap-4 mb-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kod</label>
                                <select
                                    value={selectedProduct.code}
                                    onChange={(e) => handleProductSelect(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Seçiniz</option>
                                    {productList.map(product => (
                                        <option key={product.code} value={product.code}>
                                            {product.code} - {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Miktar</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        value={selectedProduct.quantity}
                                        onChange={(e) => handleQuantityChange(e.target.value)}
                                        className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-md">
                                        {selectedProduct.unit}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat</label>
                                <input
                                    type="number"
                                    value={selectedProduct.price}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">İsk %</label>
                                <input
                                    type="number"
                                    value={selectedProduct.discount}
                                    onChange={(e) => handleDiscountChange(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tutar</label>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        value={selectedProduct.total}
                                        readOnly
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddProduct}
                                        className="ml-2 bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Eklenen Ürünler Listesi */}
                        {products.length > 0 && (
                            <div className="mt-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kod</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Miktar</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Fiyat</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">İsk %</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Tutar</th>
                                            <th className="px-4 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {products.map((product, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 text-sm text-gray-900">{product.code}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900 text-right">{product.quantity} {product.unit}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900 text-right">{product.price} EUR</td>
                                                <td className="px-4 py-2 text-sm text-gray-900 text-right">{product.discount}%</td>
                                                <td className="px-4 py-2 text-sm text-gray-900 text-right">{product.total} EUR</td>
                                                <td className="px-4 py-2 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveProduct(index)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        ×
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="5" className="px-4 py-2 text-sm font-medium text-gray-900 text-right">Toplam:</td>
                                            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                                                {products.reduce((sum, product) => sum + product.total, 0)} EUR
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/quotes')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                        Kaydet
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuoteForm; 