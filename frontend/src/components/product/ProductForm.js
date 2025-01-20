import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        category: '',
        type: 'product', // 'product' veya 'service'
        unit: '',
        basePrice: '',
        currency: 'EUR',
        status: 'active',
        customFields: [],
        variants: [],
        taxRate: 18,
        minQuantity: 1,
        maxQuantity: null,
        stockTracking: false,
        stockQuantity: 0,
        images: []
    });

    // Seçenekler
    const categories = [
        { id: 1, name: 'Gergi Tavan' },
        { id: 2, name: 'Hizmet' },
        { id: 3, name: 'Yedek Parça' }
    ];

    const units = [
        { id: 'm²', name: 'Metrekare' },
        { id: 'm', name: 'Metre' },
        { id: 'adet', name: 'Adet' },
        { id: 'saat', name: 'Saat' }
    ];

    const currencies = ['TL', 'USD', 'EUR'];

    const [customFieldTypes] = useState([
        { id: 'text', name: 'Metin' },
        { id: 'number', name: 'Sayı' },
        { id: 'select', name: 'Seçim' },
        { id: 'checkbox', name: 'Onay Kutusu' },
        { id: 'date', name: 'Tarih' }
    ]);

    useEffect(() => {
        if (isEditMode) {
            // API'den ürün detaylarını getir
            console.log('Ürün detayları getiriliyor:', id);
        }
    }, [id, isEditMode]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCustomFieldAdd = () => {
        setFormData(prev => ({
            ...prev,
            customFields: [
                ...prev.customFields,
                { name: '', type: 'text', required: false, options: [] }
            ]
        }));
    };

    const handleCustomFieldChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            customFields: prev.customFields.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleCustomFieldRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            customFields: prev.customFields.filter((_, i) => i !== index)
        }));
    };

    const handleVariantAdd = () => {
        setFormData(prev => ({
            ...prev,
            variants: [
                ...prev.variants,
                { name: '', options: [], priceAdjustment: 0 }
            ]
        }));
    };

    const handleVariantChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleVariantRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const handleImageRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // API çağrısı yapılacak
            console.log('Form gönderiliyor:', formData);
            navigate('/products');
        } catch (error) {
            console.error('Form gönderilirken hata:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    {isEditMode ? 'ÜRÜN/HİZMET DÜZENLE' : 'YENİ ÜRÜN/HİZMET EKLE'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Temel Bilgiler */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                            <div className="flex gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="product"
                                        checked={formData.type === 'product'}
                                        onChange={handleInputChange}
                                        className="text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Ürün</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="service"
                                        checked={formData.type === 'service'}
                                        onChange={handleInputChange}
                                        className="text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Hizmet</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kod</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Seçiniz</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Birim</label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Seçiniz</option>
                                {units.map(unit => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Baz Fiyat</label>
                                <input
                                    type="number"
                                    name="basePrice"
                                    value={formData.basePrice}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    {currencies.map(currency => (
                                        <option key={currency} value={currency}>
                                            {currency}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">KDV Oranı (%)</label>
                            <input
                                type="number"
                                name="taxRate"
                                value={formData.taxRate}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min. Miktar</label>
                                <input
                                    type="number"
                                    name="minQuantity"
                                    value={formData.minQuantity}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Maks. Miktar</label>
                                <input
                                    type="number"
                                    name="maxQuantity"
                                    value={formData.maxQuantity || ''}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="stockTracking"
                                    checked={formData.stockTracking}
                                    onChange={handleInputChange}
                                    className="text-orange-500 focus:ring-orange-500 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">Stok Takibi</span>
                            </label>
                            {formData.stockTracking && (
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        name="stockQuantity"
                                        value={formData.stockQuantity}
                                        onChange={handleInputChange}
                                        placeholder="Stok Miktarı"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Özel Alanlar */}
                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Özel Alanlar</h3>
                        <button
                            type="button"
                            onClick={handleCustomFieldAdd}
                            className="text-orange-500 hover:text-orange-600"
                        >
                            + Yeni Alan Ekle
                        </button>
                    </div>
                    <div className="space-y-4">
                        {formData.customFields.map((field, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={field.name}
                                        onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
                                        placeholder="Alan Adı"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <select
                                        value={field.type}
                                        onChange={(e) => handleCustomFieldChange(index, 'type', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        {customFieldTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={field.required}
                                            onChange={(e) => handleCustomFieldChange(index, 'required', e.target.checked)}
                                            className="text-orange-500 focus:ring-orange-500 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Zorunlu</span>
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleCustomFieldRemove(index)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Varyantlar */}
                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Varyantlar</h3>
                        <button
                            type="button"
                            onClick={handleVariantAdd}
                            className="text-orange-500 hover:text-orange-600"
                        >
                            + Yeni Varyant Ekle
                        </button>
                    </div>
                    <div className="space-y-4">
                        {formData.variants.map((variant, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={variant.name}
                                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                        placeholder="Varyant Adı (örn. Renk)"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={variant.options.join(', ')}
                                        onChange={(e) => handleVariantChange(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                                        placeholder="Seçenekler (virgülle ayırın)"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="w-32">
                                    <input
                                        type="number"
                                        value={variant.priceAdjustment}
                                        onChange={(e) => handleVariantChange(index, 'priceAdjustment', parseFloat(e.target.value))}
                                        placeholder="Fiyat Farkı"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleVariantRemove(index)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Görseller */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Görseller</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full"
                        />
                        {formData.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-4 gap-4">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Ürün görseli ${index + 1}`}
                                            className="w-full h-24 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleImageRemove(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Butonları */}
                <div className="flex justify-end space-x-3 border-t pt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/products')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                        {isEditMode ? 'Güncelle' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm; 