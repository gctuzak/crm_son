import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api/api';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        category_id: '',
        type: 'product',
        unit_id: '',
        base_price: '',
        currency: 'TRY',
        status: 'active',
        tax_rate: 18,
        min_quantity: 1,
        max_quantity: null,
        stock_tracking: false,
        stock_quantity: 0,
        customFields: [],
        variants: [],
        images: []
    });

    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currencies = ['TRY', 'USD', 'EUR'];

    const [customFieldTypes] = useState([
        { id: 'text', name: 'Metin' },
        { id: 'number', name: 'Sayı' },
        { id: 'select', name: 'Seçim' },
        { id: 'checkbox', name: 'Onay Kutusu' },
        { id: 'date', name: 'Tarih' }
    ]);

    const statusOptions = [
        { id: 'active', name: 'Aktif' },
        { id: 'passive', name: 'Pasif' },
        { id: 'draft', name: 'Taslak' }
    ];

    const categoryPrefixes = {
        1: 'GT',    // Gergi Tavan
        2: 'HZM',   // Hizmet
        3: 'LED',   // LED
        4: 'YP',    // Yedek Parça
        5: 'TRF'    // Trafo
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [categoriesRes, unitsRes] = await Promise.all([
                    api.get('/products/categories'),
                    api.get('/products/units')
                ]);

                setCategories(categoriesRes.data);
                setUnits(unitsRes.data);

                if (isEditMode) {
                    const productRes = await api.get(`/products/${id}`);
                    setFormData(prev => ({
                        ...prev,
                        ...productRes.data,
                        customFields: productRes.data.customFields || [],
                        variants: productRes.data.variants || [],
                        images: []
                    }));
                }
            } catch (err) {
                setError(err.message);
                console.error('Veri yüklenirken hata:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode]);

    const handleCategoryChange = (value) => {
        const prefix = categoryPrefixes[value] || '';
        setFormData(prev => ({
            ...prev,
            category_id: value,
            code: prefix ? `${prefix}.` : ''  // Kategori seçildiğinde prefix'i ekle
        }));
    };

    const handleCodeChange = (e) => {
        const prefix = categoryPrefixes[formData.category_id];
        const newCode = e.target.value;
        
        // Eğer bir prefix varsa ve kullanıcı onu silmeye çalışıyorsa, izin verme
        if (prefix && !newCode.startsWith(`${prefix}.`)) {
            return;
        }
        
        setFormData(prev => ({
            ...prev,
            code: newCode
        }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue = type === 'checkbox' ? checked : value;

        // Para birimi alanları için decimal validasyonu
        if (['base_price', 'price_adjustment'].includes(name)) {
            finalValue = value.replace(/[^0-9.]/g, '');
            const parts = finalValue.split('.');
            if (parts[1]?.length > 2) return; // 2 decimal'dan fazlasına izin verme
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));

        // Ürün kodu validasyonu sadece kod değiştiğinde ve kategori seçiliyse yapılsın
        if (name === 'code' && formData.category_id) {
            const prefix = categoryPrefixes[formData.category_id];
            if (!validateProductCode(value)) {
                setError(`Geçersiz ürün kodu formatı. Beklenen format: ${prefix}XXX (Örn: ${prefix}001)`);
            } else {
                setError(null);
            }
        } else if (name === 'category_id') {
            // Kategori değiştiğinde ve kod varsa validasyon yap
            if (formData.code) {
                const prefix = categoryPrefixes[value];
                if (!validateProductCode(formData.code)) {
                    setError(`Geçersiz ürün kodu formatı. Beklenen format: ${prefix}XXX (Örn: ${prefix}001)`);
                } else {
                    setError(null);
                }
            }
        } else {
            setError(null);
        }
    };

    const handleCustomFieldAdd = () => {
        setFormData(prev => ({
            ...prev,
            customFields: [
                ...prev.customFields,
                { name: '', field_type: 'text', is_required: false, options: [] }
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
                { name: '', options: [], price_adjustment: 0 }
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
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        const validFiles = files.filter(file => {
            if (file.size > maxSize) {
                setError(`${file.name} boyutu çok büyük. Maksimum 5MB yükleyebilirsiniz.`);
                return false;
            }
            if (!allowedTypes.includes(file.type)) {
                setError(`${file.name} desteklenmeyen dosya türü. Sadece JPEG, PNG ve WebP formatları desteklenir.`);
                return false;
            }
            return true;
        });

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...validFiles]
        }));
    };

    const handleImageRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const validateProductCode = (code) => {
        const prefix = categoryPrefixes[formData.category_id];
        if (!prefix) return true; // Kategori seçilmediyse validation yapma
        
        // Kod prefix ile başlamalı ve en az bir karakter daha içermeli
        return code.startsWith(`${prefix}.`) && code.length > prefix.length + 1;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Form validasyonu
        if (!formData.category_id) {
            setError('Lütfen kategori seçin');
            return;
        }
        
        if (!validateProductCode(formData.code)) {
            const prefix = categoryPrefixes[formData.category_id];
            setError(`Geçersiz ürün kodu formatı. Kod "${prefix}." ile başlamalı ve devamında en az bir karakter içermeli.`);
            return;
        }
        
        try {
            const formDataToSend = new FormData();
            
            // Ana ürün bilgileri
            Object.keys(formData).forEach(key => {
                if (key !== 'images' && key !== 'customFields' && key !== 'variants') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Özel alanlar ve varyantlar
            formDataToSend.append('customFields', JSON.stringify(formData.customFields));
            formDataToSend.append('variants', JSON.stringify(formData.variants));

            // Görseller
            formData.images.forEach(image => {
                formDataToSend.append('images', image);
            });

            const response = isEditMode
                ? await api.put(`/products/${id}`, formDataToSend)
                : await api.post('/products', formDataToSend);

            if (response.data) {
                navigate('/products');
            }
        } catch (error) {
            console.error('Ürün kaydedilirken hata oluştu:', error);
            setError('Ürün kaydedilirken bir hata oluştu');
        }
    };

    if (loading) {
        return <div className="p-4">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Hata: {error}</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    {isEditMode ? 'ÜRÜN/HİZMET DÜZENLE' : 'YENİ ÜRÜN/HİZMET EKLE'}
                </h2>
            </div>

            <Form onSubmit={handleSubmit} className="space-y-6">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <Select
                                value={formData.category_id ? String(formData.category_id) : undefined}
                                onChange={handleCategoryChange}
                                placeholder="Kategori seçin"
                                style={{ width: '100%' }}
                                className="w-full"
                            >
                                <Option value="1">Gergi Tavan</Option>
                                <Option value="2">Hizmet</Option>
                                <Option value="3">LED</Option>
                                <Option value="4">Yedek Parça</Option>
                                <Option value="5">Trafo</Option>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kod</label>
                            <Input
                                value={formData.code}
                                onChange={handleCodeChange}
                                placeholder="Ürün kodu"
                                style={{ width: '100%' }}
                                className="w-full"
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
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Birim</label>
                            <select
                                name="unit_id"
                                value={formData.unit_id}
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
                                    name="base_price"
                                    value={formData.base_price}
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
                                name="tax_rate"
                                value={formData.tax_rate}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min. Miktar</label>
                                <input
                                    type="number"
                                    name="min_quantity"
                                    value={formData.min_quantity}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Maks. Miktar</label>
                                <input
                                    type="number"
                                    name="max_quantity"
                                    value={formData.max_quantity || ''}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="stock_tracking"
                                    checked={formData.stock_tracking}
                                    onChange={handleInputChange}
                                    className="text-orange-500 focus:ring-orange-500 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">Stok Takibi</span>
                            </label>
                            {formData.stock_tracking && (
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        name="stock_quantity"
                                        value={formData.stock_quantity}
                                        onChange={handleInputChange}
                                        placeholder="Stok Miktarı"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
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
                                        value={field.field_type}
                                        onChange={(e) => handleCustomFieldChange(index, 'field_type', e.target.value)}
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
                                            checked={field.is_required}
                                            onChange={(e) => handleCustomFieldChange(index, 'is_required', e.target.checked)}
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
                                        value={variant.price_adjustment}
                                        onChange={(e) => handleVariantChange(index, 'price_adjustment', parseFloat(e.target.value))}
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
            </Form>
        </div>
    );
};

export default ProductForm; 