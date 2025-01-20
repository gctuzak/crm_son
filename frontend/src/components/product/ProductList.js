import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [totalRecords] = useState(156);

    // Mock veriler
    const products = [
        {
            id: 1,
            code: 'GT.TD.USC.01',
            name: 'USC Translucent 0,22mm Gergi Tavan',
            category: 'Gergi Tavan',
            unit: 'm²',
            basePrice: '40 EUR',
            status: 'Aktif',
            lastUpdate: '2 gün önce'
        },
        {
            id: 2,
            code: 'HZM.MNT.001',
            name: 'Montaj Hizmeti',
            category: 'Hizmet',
            unit: 'Saat',
            basePrice: '25 EUR',
            status: 'Aktif',
            lastUpdate: '1 hafta önce'
        }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Arama yapılıyor:', searchTerm);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">ÜRÜN / HİZMET LİSTESİ</h2>
                <button 
                    onClick={() => navigate('/products/new')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
                >
                    Yeni Ekle
                </button>
            </div>

            {/* Arama ve Filtre */}
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Ürün/Hizmet Ara..."
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 text-sm font-medium flex items-center"
                    >
                        Ara
                    </button>
                </form>
            </div>

            {/* Kayıt Sayısı */}
            <div className="flex justify-between items-center mb-4 text-sm text-gray-600 border-b border-gray-100 pb-4">
                <span>Toplam Kayıt: {totalRecords}</span>
            </div>

            {/* Ürün Listesi */}
            <div className="space-y-3">
                {products.map((product) => (
                    <div 
                        key={product.id} 
                        className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white group cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}/edit`)}
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-orange-500 text-2xl mt-1">📦</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-orange-500 transition-colors duration-200">
                                            {product.name}
                                        </h3>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Kod:</span> {product.code}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Kategori:</span> {product.category}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Birim:</span> {product.unit}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Baz Fiyat:</span> {product.basePrice}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                <span className="font-medium">Son güncelleme:</span> {product.lastUpdate}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-sm whitespace-nowrap px-3 py-1 rounded-full ${
                                        product.status === 'Aktif' 
                                            ? 'text-green-500 bg-green-50' 
                                            : 'text-gray-500 bg-gray-50'
                                    }`}>
                                        {product.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList; 