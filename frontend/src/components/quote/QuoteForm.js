import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Select, Input, Form, AutoComplete, Button } from 'antd';
import api from '../../services/api/api';
import debounce from 'lodash/debounce';
import { DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const QuoteForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company: '',
        companyName: '',
        customer: null,
        customerName: '',
        quoteNumber: '2621', // Otomatik oluşturulacak
        assignee: '',
        status: '',
        sendDate: '',
        quoteType: '',
        city: '',
        projectName: '',
        amount: '',
        currency: 'TRY',
        paymentType: '',
        notes: '',
        systemDate: new Date().toISOString().split('T')[0],
        items: [],
    });

    const [showProductForm, setShowProductForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [productList, setProductList] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({
        code: '',
        quantity: 1,
        unit: 'm²',
        price: '',
        currency: 'TRY',
        tax_rate: 20,
        discount: 0,
        total: 0,
        description: '',
        calculatedItems: [] // Hesaplanan ürünleri tutacak yeni alan
    });

    const [companies, setCompanies] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchResults, setSearchResults] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const searchInputRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [showCustomerList, setShowCustomerList] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productCodes, setProductCodes] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [showCustomSizeButton, setShowCustomSizeButton] = useState(false);
    const [showCustomSizeModal, setShowCustomSizeModal] = useState(false);
    const [customSizeData, setCustomSizeData] = useState([
        ['', '', '', ''], // Her satır 4 hücre içerecek
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', '']
    ]);

    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Her modal için ayrı state'ler
    const [productModalPosition, setProductModalPosition] = useState({ x: 0, y: 0 });
    const [productModalDragging, setProductModalDragging] = useState(false);
    const [productModalDragStart, setProductModalDragStart] = useState({ x: 0, y: 0 });

    const [customSizeModalPosition, setCustomSizeModalPosition] = useState({ x: 0, y: 0 });
    const [customSizeModalDragging, setCustomSizeModalDragging] = useState(false);
    const [customSizeModalDragStart, setCustomSizeModalDragStart] = useState({ x: 0, y: 0 });

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

    const currencies = ['TRY', 'USD', 'EUR'];

    // Birim listesi güncelleniyor
    const units = ['m', 'm²', 'saat', 'adet', 'set', 'takım'];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Kişileri ve şirketleri getir
                const [personsResponse, companiesResponse] = await Promise.all([
                    api.get('/persons'),
                    api.get('/companies')
                ]);

                // API yanıtından rows verilerini al
                if (personsResponse.data?.data?.rows) {
                    setCustomers(personsResponse.data.data.rows);
                }

                if (companiesResponse.data?.data?.rows) {
                    setCompanies(companiesResponse.data.data.rows);
                }

                // Ürünleri getir
                const productsResponse = await api.get('/products');
                if (productsResponse.data?.data?.rows) {
                    setProductList(productsResponse.data.data.rows);
                }
            } catch (err) {
                console.error('Veri yüklenirken hata:', err);
                setError('Veriler yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Şirket seçildiğinde ilgili kişileri filtrele
    useEffect(() => {
        if (formData.company) {
            const filtered = customers.filter(customer => customer.company_id === parseInt(formData.company));
            setFilteredCustomers(filtered);
            // Eğer seçili kişi filtrelenmiş listede yoksa, seçimi temizle
            if (!filtered.find(c => c.id === parseInt(formData.customer))) {
                setFormData(prev => ({ ...prev, customer: '' }));
            }
        } else {
            setFilteredCustomers([]);
            setFormData(prev => ({ ...prev, customer: '' }));
        }
    }, [formData.company, customers]);

    useEffect(() => {
        if (searchText.length >= 3) {
            setDropdownVisible(true);
        } else {
            setDropdownVisible(false);
        }
    }, [searchText]);

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

    // Ürünleri getir
    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            if (response.data) {
                setProductList(response.data);
            }
        } catch (error) {
            console.error('Ürünler yüklenirken hata:', error);
        }
    };

    // Ürün formu açıldığında ürünleri getir
    useEffect(() => {
        if (showProductForm) {
            fetchProducts();
        }
    }, [showProductForm]);

    // Modal açıldığında ve kategori değiştiğinde ürünleri filtrele
    useEffect(() => {
        if (showProductForm && selectedCategory && productList.length > 0) {
            const filtered = productList.filter(p => p.category_id === parseInt(selectedCategory));
            setFilteredProducts(filtered);
        }
    }, [showProductForm, selectedCategory, productList]);

    const handleProductSelect = (code) => {
        const product = productList.find(p => p.code === code);
        if (product) {
            setSelectedProduct(prev => ({
                ...prev,
                code: product.code,
                name: product.name,
                price: product.base_price,
                currency: product.currency || 'TRY',
                tax_rate: product.tax_rate || 20,
                unit: product.unit || 'm²',
                description: product.description || ''
            }));
        };
    };

    const handleCurrencyChange = (currency) => {
        setSelectedProduct(prev => ({
            ...prev,
            currency
        }));
    };

    const handleTaxRateChange = (value) => {
        const tax_rate = parseFloat(value) || 0;
        setSelectedProduct(prev => ({
            ...prev,
            tax_rate: Math.min(100, Math.max(0, tax_rate))
        }));
    };

    const calculateTotal = (quantity, price, discount, tax_rate) => {
        const subtotal = quantity * price * (1 - discount / 100);
        const tax = subtotal * (tax_rate / 100);
        return subtotal + tax;
    };

    const handleQuantityChange = (value) => {
        const quantity = parseFloat(value) || 0;
        setSelectedProduct(prev => ({
            ...prev,
            quantity,
            total: calculateTotal(quantity, prev.price, prev.discount, prev.tax_rate)
        }));
    };

    const handleDiscountChange = (value) => {
        const discount = parseFloat(value) || 0;
        setSelectedProduct(prev => ({
            ...prev,
            discount,
            total: calculateTotal(prev.quantity, prev.price, discount, prev.tax_rate)
        }));
    };

    const handleUnitChange = (value) => {
        setSelectedProduct(prev => ({
            ...prev,
            unit: value
        }));
    };

    const handleAddProduct = (selectedProduct) => {
        if (selectedProduct.calculatedItems && selectedProduct.calculatedItems.length > 0) {
            // Hesaplanmış özel ölçülü ürünler için
            selectedProduct.calculatedItems.forEach(item => {
                const newItem = {
                    code: selectedProduct.code,
                    name: selectedProduct.name,
                    description: item.description,
                    width: item.width,
                    height: item.height,
                    quantity: item.quantity,
                    amount: item.amount,
                    unit: item.unit,
                    unitPrice: selectedProduct.price,
                    currency: selectedProduct.currency || 'TRY',
                discount: 0,
                    tax_rate: selectedProduct.tax_rate || 20,
                    total: 0 // calculateItemTotal fonksiyonu ile hesaplanacak
                };

                // Toplam tutarı hesapla
                newItem.total = calculateItemTotal(newItem);

                setFormData(prev => ({
                    ...prev,
                    items: [...prev.items, newItem]
                }));
            });
        } else {
            // Normal ürün ekleme için mevcut mantık
            const newItem = {
                code: selectedProduct.code,
                name: selectedProduct.name,
                description: selectedProduct.description || '',
                width: '',
                height: '',
                quantity: 1,
                amount: '',
                unit: selectedProduct.unit,
                unitPrice: selectedProduct.price,
                currency: selectedProduct.currency || 'TRY',
                discount: 0,
                tax_rate: selectedProduct.tax_rate || 20,
                total: selectedProduct.price
            };

            setFormData(prev => ({
                ...prev,
                items: [...prev.items, newItem]
            }));
        }

        setShowProductForm(false);
    };

    const handleRemoveItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const calculateItemTotal = (item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const amount = parseFloat(item.amount) || 0;
        const unitPrice = parseFloat(item.unitPrice) || 0;
        const discount = parseFloat(item.discount) || 0;
        const tax_rate = parseFloat(item.tax_rate) || 0;

        // Miktar * Birim Fiyat
        const subtotal = amount * unitPrice;
        
        // İskonto hesaplama
        const discountAmount = subtotal * (discount / 100);
        const afterDiscount = subtotal - discountAmount;
        
        // KDV hesaplama
        const taxAmount = afterDiscount * (tax_rate / 100);
        
        // Toplam
        return afterDiscount + taxAmount;
    };

    const updateItemField = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map((item, i) => {
                if (i === index) {
                    const updatedItem = { 
                        ...item, 
                        [field]: value,
                        discount: item.discount || 0,
                        tax_rate: item.tax_rate || 20
                    };

                    // Sadece adet girildiğinde en-boy kontrolü ve miktar hesaplama
                    if (field === 'quantity') {
                        const width = parseFloat(item.width) || 0;
                        const height = parseFloat(item.height) || 0;
                        const quantity = parseInt(value) || 0;

                        // En ve boy değerlerini karşılaştır ve gerekirse yer değiştir
                        if (width > height && width > 0 && height > 0) {
                            // En değeri daha büyükse yer değiştir
                            updatedItem.width = height;
                            updatedItem.height = width;
                        }

                        // Miktar hesaplama
                        if (width > 0 && height > 0 && quantity > 0) {
                            if (updatedItem.width <= 50) { // 50cm ve altındaysa metre hesabı
                                // Boy'u metreye çevir (cm'den m'ye)
                                const metreBoy = updatedItem.height / 100;
                                updatedItem.amount = metreBoy * quantity;
                                updatedItem.unit = 'm';
                            } else { // 50cm üstündeyse metrekare hesabı
                                updatedItem.amount = ((updatedItem.width * updatedItem.height) / 10000) * quantity;
                                updatedItem.unit = 'm²';
                            }
                        }
                    }
                    // En veya boy değiştiğinde sadece miktar hesaplama
                    else if (field === 'width' || field === 'height') {
                        const width = parseFloat(field === 'width' ? value : item.width) || 0;
                        const height = parseFloat(field === 'height' ? value : item.height) || 0;
                        const quantity = parseInt(item.quantity) || 0;

                        if (width > 0 && height > 0 && quantity > 0) {
                            if (width <= 50) { // 50cm ve altındaysa metre hesabı
                                const metreBoy = height / 100;
                                updatedItem.amount = metreBoy * quantity;
                                updatedItem.unit = 'm';
                            } else { // 50cm üstündeyse metrekare hesabı
                                updatedItem.amount = ((width * height) / 10000) * quantity;
                                updatedItem.unit = 'm²';
                            }
                        }
                    }

                    // Toplam tutarı hesapla
                    const amount = parseFloat(updatedItem.amount) || 0;
                    const unitPrice = parseFloat(updatedItem.unitPrice) || 0;
                    const discount = parseFloat(updatedItem.discount) || 0;
                    const tax_rate = parseFloat(updatedItem.tax_rate) || 0;

                    const subtotal = amount * unitPrice;
                    const discountAmount = subtotal * (discount / 100);
                    const afterDiscount = subtotal - discountAmount;
                    const taxAmount = afterDiscount * (tax_rate / 100);
                    updatedItem.total = afterDiscount + taxAmount;

                    return updatedItem;
                }
                return item;
            })
        }));
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

    // Müşteri arama fonksiyonu
    const handleSearch = debounce(async (value) => {
        if (!value || value.length < 3) {
            setSearchResults([]);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get(`/customers/search?query=${encodeURIComponent(value)}`);
            const options = response.data.map(item => ({
                key: String(item.id),
                value: item.displayName,
                label: item.displayName,
                type: item.type,
                data: item
            }));
            setSearchResults(options);
        } catch (error) {
            console.error('Müşteri arama hatası:', error);
        } finally {
            setLoading(false);
        }
    }, 300);

    const handleSearchTextChange = (text) => {
        setSearchText(text);
        if (text.length < 3) {
            setSearchResults([]);
        } else {
            handleSearch(text);
        }
    };

    // Müşteri seçildiğinde
    const handleCustomerSelect = async (item, type) => {
        if (type === 'person') {
            setSelectedCustomer(item);
            
            if (item.company_id) {
                // Kişi bir şirkette çalışıyorsa
                const company = companies.find(c => c.id === item.company_id);
                if (company) {
                    setSearchTerm(company.name); // Müşteri kutusuna şirket adı
                    setFormData(prev => ({
                        ...prev,
                        customer: { ...company, type: 'company' },
                        contact: item // İlgili kişi olarak seçilen kişi
                    }));

                    // Şirketin diğer çalışanlarını getir
                    try {
                        const response = await api.get(`/customers/company/${company.id}/persons`);
                        if (response.data) {
                            setContacts(response.data.map(person => ({
                                value: String(person.id),
                                label: `${person.first_name} ${person.last_name}`,
                                data: person
                            })));
                        }
                    } catch (error) {
                        console.error('Şirket çalışanları getirme hatası:', error);
                        setContacts([]);
                    }
                }
            } else {
                // Kişi herhangi bir şirkette çalışmıyorsa
                setSearchTerm(''); // Müşteri kutusunu temizle
                setFormData(prev => ({
                    ...prev,
                    customer: null,
                    contact: item // İlgili kişi olarak seçilen kişi
                }));
                setContacts([{
                    value: String(item.id),
                    label: `${item.first_name} ${item.last_name}`,
                    data: item
                }]);
            }
        } else {
            // Şirket seçildiğinde
            setSelectedCustomer(item);
            setSearchTerm(item.name);
            setFormData(prev => ({
                ...prev,
                customer: { ...item, type: 'company' },
                contact: null
            }));

            // Şirket çalışanlarını getir
            try {
                const response = await api.get(`/customers/company/${item.id}/persons`);
                if (response.data) {
                    setContacts(response.data.map(person => ({
                        value: String(person.id),
                        label: `${person.first_name} ${person.last_name}`,
                        data: person
                    })));
                }
        } catch (error) {
                console.error('Şirket çalışanları getirme hatası:', error);
                setContacts([]);
            }
        }
        setShowCustomerList(false);
    };

    // İlgili kişi seçildiğinde
    const handleContactSelect = (value, option) => {
        setFormData(prev => ({
            ...prev,
            contact: option.data
        }));
    };

    const handleCustomerSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (!value) {
            setSelectedCustomer(null);
            setFormData(prev => ({ ...prev, customer: null, contact: null }));
            setShowCustomerList(false);
            return;
        }

        setShowCustomerList(true);
    };

    const getFilteredResults = () => {
        const searchTermLower = searchTerm.toLowerCase().trim();
        
        // Kişileri sadece isimleri üzerinden ara
        const filteredPersons = customers.filter(person => {
            if (!person) return false;
            const firstName = (person.first_name || '').toLowerCase();
            const lastName = (person.last_name || '').toLowerCase();
            return firstName.includes(searchTermLower) || lastName.includes(searchTermLower);
        });

        // Şirketleri sadece şirket adı üzerinden ara
        const filteredCompanies = companies.filter(company => {
            if (!company) return false;
            const companyName = (company.name || '').toLowerCase();
            return companyName.includes(searchTermLower);
        });

        console.log('Filtreleme sonuçları:', {
            searchTerm: searchTermLower,
            persons: filteredPersons,
            companies: filteredCompanies,
            allCustomers: customers,
            allCompanies: companies
        });

        return {
            persons: filteredPersons,
            companies: filteredCompanies
        };
    };

    // Kategori değiştiğinde ürün adlarını filtrele
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setShowCustomSizeButton(categoryId === "1"); // Gergi Tavan kategorisi seçildiğinde butonu göster
        const filtered = productList.filter(p => p.category_id === parseInt(categoryId));
        setFilteredProducts(filtered);
        setSelectedProduct(prev => ({
            ...prev,
            code: '',
            name: '',
            price: '',
            currency: 'TRY',
            tax_rate: 20,
            unit: 'm²',
            description: ''
        }));
    };

    // Ürün adı seçildiğinde ürün kodlarını filtrele
    const handleNameSelect = (name) => {
        const filtered = filteredProducts.filter(p => p.name === name);
        setProductCodes(filtered);
        if (filtered.length === 1) {
            handleProductSelect(filtered[0].code);
        }
    };

    // Ürün kodu seçildiğinde ürünü seç
    const handleCodeSelect = (code) => {
        handleProductSelect(code);
    };

    // Excel verilerini işle
    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text');
        const rows = pasteData.split('\n').map(row => row.split('\t'));
        
        // Mevcut tabloyu güncelle
        const newData = [...customSizeData];
        rows.forEach((row, rowIndex) => {
            if (rowIndex < newData.length) {
                row.forEach((cell, cellIndex) => {
                    if (cellIndex < 4) {
                        newData[rowIndex][cellIndex] = cell.trim();
                    }
                });
            }
        });
        setCustomSizeData(newData);
    };

    // Hücre değerini güncelle ve alanı hesapla
    const handleCellChange = (rowIndex, cellIndex, value) => {
        const newData = [...customSizeData];
        
        if (cellIndex === 2) { // Adet değiştiğinde
            // Önce adeti güncelle
            newData[rowIndex][cellIndex] = value;
            
            // En ve Boy değerlerini al
            const en = parseFloat(newData[rowIndex][0]) || 0;
            const boy = parseFloat(newData[rowIndex][1]) || 0;
            
            if (en > 0 && boy > 0) {
                // En ve boy değerlerini karşılaştır ve gerekirse yer değiştir
                if (en > boy) {
                    // En değeri daha büyükse yer değiştir
                    newData[rowIndex][0] = boy;
                    newData[rowIndex][1] = en;
                }
                
                // Güncel değerlerle hesaplama yap
                const adet = parseInt(value) || 0;
                
                // En 50cm ve altındaysa metre hesabı yap
                if (newData[rowIndex][0] <= 50) {
                    // Boy'u metreye çevir (cm'den m'ye)
                    const metreBoy = newData[rowIndex][1] / 100;
                    const toplamMetre = metreBoy * adet;
                    newData[rowIndex][3] = toplamMetre.toFixed(2) + ' m';
                } else {
                    // En 50cm'den büyükse metrekare hesabı yap
                    const alan = ((newData[rowIndex][0] * newData[rowIndex][1]) / 10000) * adet;
                    newData[rowIndex][3] = alan.toFixed(2) + ' m²';
                }
            }
        } else {
            // En veya Boy değiştiğinde sadece değeri güncelle
            newData[rowIndex][cellIndex] = value;
            
            // Eğer hem en hem boy hem de adet girilmişse hesapla
            const en = parseFloat(newData[rowIndex][0]) || 0;
            const boy = parseFloat(newData[rowIndex][1]) || 0;
            const adet = parseInt(newData[rowIndex][2]) || 0;
            
            if (en > 0 && boy > 0 && adet > 0) {
                // En 50cm ve altındaysa metre hesabı yap
                if (en <= 50) {
                    const metreBoy = boy / 100;
                    const toplamMetre = metreBoy * adet;
                    newData[rowIndex][3] = toplamMetre.toFixed(2) + ' m';
                } else {
                    const alan = ((en * boy) / 10000) * adet;
                    newData[rowIndex][3] = alan.toFixed(2) + ' m²';
                }
            }
        }

        setCustomSizeData(newData);
    };

    // Yeni satır ekle
    const handleAddRow = () => {
        setCustomSizeData([...customSizeData, ['', '', '', '']]);
    };

    // Satır sil
    const handleRemoveRow = (rowIndex) => {
        const newData = customSizeData.filter((_, index) => index !== rowIndex);
        setCustomSizeData(newData);
    };

    // Özel ölçüleri ürüne ekle
    const handleSaveCustomSize = () => {
        const calculatedItems = [];
        
        customSizeData.forEach(row => {
            const en = parseFloat(row[0]) || 0;
            const boy = parseFloat(row[1]) || 0;
            const adet = parseInt(row[2]) || 0;

            if (en > 0 && boy > 0 && adet > 0) {
                if (en <= 50) {
                    // Metre hesabı
                    const metreBoy = boy / 100;
                    const toplamMetre = metreBoy * adet;
                    calculatedItems.push({
                        width: en,
                        height: boy,
                        quantity: adet,
                        amount: toplamMetre,
                        unit: 'm',
                        description: `${en}cm x ${boy}cm`
                    });
                } else {
                    // Metrekare hesabı
                    const alan = ((en * boy) / 10000) * adet;
                    calculatedItems.push({
                        width: en,
                        height: boy,
                        quantity: adet,
                        amount: alan,
                        unit: 'm²',
                        description: `${en}cm x ${boy}cm`
                    });
                }
            }
        });

        setSelectedProduct(prev => ({
            ...prev,
            calculatedItems
        }));

        setShowCustomSizeModal(false);
    };

    // Ürün modalı için sürükleme fonksiyonları
    const handleProductModalMouseDown = (e) => {
        setProductModalDragging(true);
        setProductModalDragStart({
            x: e.clientX - productModalPosition.x,
            y: e.clientY - productModalPosition.y
        });
    };

    const handleProductModalMouseMove = (e) => {
        if (productModalDragging) {
            const newX = e.clientX - productModalDragStart.x;
            const newY = e.clientY - productModalDragStart.y;
            setProductModalPosition({ x: newX, y: newY });
        }
    };

    const handleProductModalMouseUp = () => {
        setProductModalDragging(false);
    };

    // Özel ölçü modalı için sürükleme fonksiyonları
    const handleCustomSizeModalMouseDown = (e) => {
        setCustomSizeModalDragging(true);
        setCustomSizeModalDragStart({
            x: e.clientX - customSizeModalPosition.x,
            y: e.clientY - customSizeModalPosition.y
        });
    };

    const handleCustomSizeModalMouseMove = (e) => {
        if (customSizeModalDragging) {
            const newX = e.clientX - customSizeModalDragStart.x;
            const newY = e.clientY - customSizeModalDragStart.y;
            setCustomSizeModalPosition({ x: newX, y: newY });
        }
    };

    const handleCustomSizeModalMouseUp = () => {
        setCustomSizeModalDragging(false);
    };

    useEffect(() => {
        if (productModalDragging) {
            document.addEventListener('mousemove', handleProductModalMouseMove);
            document.addEventListener('mouseup', handleProductModalMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleProductModalMouseMove);
            document.removeEventListener('mouseup', handleProductModalMouseUp);
        };
    }, [productModalDragging]);

    useEffect(() => {
        if (customSizeModalDragging) {
            document.addEventListener('mousemove', handleCustomSizeModalMouseMove);
            document.addEventListener('mouseup', handleCustomSizeModalMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleCustomSizeModalMouseMove);
            document.removeEventListener('mouseup', handleCustomSizeModalMouseUp);
        };
    }, [customSizeModalDragging]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center text-red-500 p-4">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">YENİ TEKLİF</h2>
            </div>

            <Form layout="vertical">
                <div className="grid grid-cols-2 gap-6">
                    {/* Sol Kolon */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">* Müşteri</label>
                            <div className="relative">
                                <Input
                                    value={searchTerm}
                                    onChange={handleCustomerSearch}
                                    placeholder="Müşteri ara - şirket veya kişi"
                                    onFocus={() => setShowCustomerList(true)}
                                />
                                {showCustomerList && searchTerm && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {/* Kişiler */}
                                        {getFilteredResults().persons.length > 0 && (
                                            <div className="px-2 py-1 text-sm text-gray-500 bg-gray-50">Kişiler</div>
                                        )}
                                        {getFilteredResults().persons.map(person => (
                                            <div
                                                key={`person_${person.id}`}
                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleCustomerSelect(person, 'person')}
                                            >
                                                {person.first_name} {person.last_name}
                                                {person.company_name && <span className="text-gray-500"> - {person.company_name}</span>}
                            </div>
                                        ))}

                                        {/* Şirketler */}
                                        {getFilteredResults().companies.length > 0 && (
                                            <div className="px-2 py-1 text-sm text-gray-500 bg-gray-50">Şirketler</div>
                                        )}
                                        {getFilteredResults().companies.map(company => (
                                            <div
                                                key={`company_${company.id}`}
                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleCustomerSelect(company, 'company')}
                                        >
                                            {company.name}
                                        </div>
                                    ))}

                                        {getFilteredResults().persons.length === 0 && getFilteredResults().companies.length === 0 && (
                                            <div className="px-4 py-2 text-gray-500">Sonuç bulunamadı</div>
                            )}
                        </div>
                                )}
                            </div>
                                    </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">İlgili Kişi</label>
                            <Select
                                value={formData.contact?.id ? String(formData.contact.id) : undefined}
                                onChange={handleContactSelect}
                                placeholder="İlgili kişi seçin"
                                style={{ width: '100%' }}
                                disabled={!formData.customer || (formData.customer.type === 'person')}
                            >
                                {contacts.map(contact => (
                                    <Option key={contact.value} value={contact.value}>
                                        {contact.label}
                                    </Option>
                                ))}
                            </Select>
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
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Daha sonra kullanıcılar modülünden seçilecek"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Son Durum</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">Seçiniz</option>
                                {quoteStatuses.map(status => (
                                    <option key={status.id} value={status.id}>{status.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* Sağ Kolon */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gönderim Tarihi</label>
                            <input
                                type="date"
                                name="sendDate"
                                value={formData.sendDate}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teklif Şekli</label>
                            <select
                                name="quoteType"
                                value={formData.quoteType}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">Seçiniz</option>
                                {quoteTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                    </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Uygulanacak Şehir</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Proje Adı</label>
                            <input
                                type="text"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                        </div>
                    </div>

                {/* Ürün/Hizmet Butonları */}
                <div className="mt-8 flex gap-4">
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedCategory("1");
                            setShowProductForm(true);
                            // Gergi tavan ürünlerini filtrele
                            const filtered = productList.filter(p => p.category_id === 1);
                            setFilteredProducts(filtered);
                        }}
                        className="flex-1 bg-orange-100 text-orange-600 px-4 py-3 rounded-md hover:bg-orange-200 transition-colors duration-200 text-sm font-medium"
                    >
                        Gergi Tavan Ekle
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedCategory("3");
                            setShowProductForm(true);
                        }}
                        className="flex-1 bg-orange-100 text-orange-600 px-4 py-3 rounded-md hover:bg-orange-200 transition-colors duration-200 text-sm font-medium"
                    >
                        LED Aydınlatma Ekle
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedCategory("2");
                            setShowProductForm(true);
                        }}
                        className="flex-1 bg-orange-100 text-orange-600 px-4 py-3 rounded-md hover:bg-orange-200 transition-colors duration-200 text-sm font-medium"
                    >
                        Hizmet - Servis Ekle
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedCategory("4");
                            setShowProductForm(true);
                        }}
                        className="flex-1 bg-orange-100 text-orange-600 px-4 py-3 rounded-md hover:bg-orange-200 transition-colors duration-200 text-sm font-medium"
                    >
                        Malzeme Ekle
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedCategory("5");
                            setShowProductForm(true);
                        }}
                        className="flex-1 bg-orange-100 text-orange-600 px-4 py-3 rounded-md hover:bg-orange-200 transition-colors duration-200 text-sm font-medium"
                    >
                        Özel Ürün Ekle
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedCategory("6");
                            setShowProductForm(true);
                        }}
                        className="flex-1 bg-orange-100 text-orange-600 px-4 py-3 rounded-md hover:bg-orange-200 transition-colors duration-200 text-sm font-medium"
                    >
                        Hazır armatür ekle
                    </button>
                </div>

                {/* Ürün Listesi Tablosu */}
                <div className="mt-4">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-2 py-1 text-left text-sm w-20">Kodu</th>
                                <th className="border border-gray-300 px-2 py-1 text-left text-sm w-32">Ürün Adı</th>
                                <th className="border border-gray-300 px-2 py-1 text-left text-sm w-[400px]">AÇIKLAMA</th>
                                <th className="border border-gray-300 px-2 py-1 text-center text-sm w-16">EN (cm)</th>
                                <th className="border border-gray-300 px-2 py-1 text-center text-sm w-16">BOY (cm)</th>
                                <th className="border border-gray-300 px-2 py-1 text-center text-sm w-16">ADET</th>
                                <th className="border border-gray-300 px-2 py-1 text-center text-sm w-20">MİKTAR</th>
                                <th className="border border-gray-300 px-2 py-1 text-center text-sm w-16">BİRİM</th>
                                <th className="border border-gray-300 px-2 py-1 text-right text-sm w-24">Birim Fiyat</th>
                                <th className="border border-gray-300 px-2 py-1 text-right text-sm w-20">İSKONTO</th>
                                <th className="border border-gray-300 px-2 py-1 text-right text-sm w-16">KDV</th>
                                <th className="border border-gray-300 px-2 py-1 text-right text-sm w-32">TUTAR</th>
                                <th className="border border-gray-300 px-2 py-1 text-center text-sm w-16">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.items.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-2 py-1 text-sm w-20">{item.code}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-sm w-32">{item.name}</td>
                                    <td className="border border-gray-300 px-2 py-1 w-[400px]">
                                        <Input
                                            value={item.description}
                                            onChange={(e) => updateItemField(index, 'description', e.target.value)}
                                            className="w-full text-sm"
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 w-16">
                                        <Input
                                            type="number"
                                            value={item.width}
                                            onChange={(e) => updateItemField(index, 'width', e.target.value)}
                                            className="w-full text-center text-sm"
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 w-16">
                                        <Input
                                            type="number"
                                            value={item.height}
                                            onChange={(e) => updateItemField(index, 'height', e.target.value)}
                                            className="w-full text-center text-sm"
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 w-16">
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateItemField(index, 'quantity', e.target.value)}
                                            className="w-full text-center text-sm"
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 w-20">
                                        <Input
                                            type="number"
                                            value={item.amount}
                                            onChange={(e) => updateItemField(index, 'amount', e.target.value)}
                                            className="w-full text-center text-sm"
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 w-16">
                                        <Select
                                            value={item.unit}
                                            onChange={(value) => updateItemField(index, 'unit', value)}
                                            className="w-full text-sm"
                                        >
                                            {units.map(unit => (
                                                <Option key={unit} value={unit}>{unit}</Option>
                                            ))}
                                        </Select>
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 w-24">
                                        <Input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) => updateItemField(index, 'unitPrice', e.target.value)}
                                            className="w-full text-right text-sm"
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 w-20">
                                        <Input
                                            type="number"
                                            value={item.discount}
                                            onChange={(e) => updateItemField(index, 'discount', e.target.value)}
                                            className="w-full text-right text-sm"
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 w-16">
                                        <Input
                                            type="number"
                                            value={item.tax_rate}
                                            onChange={(e) => updateItemField(index, 'tax_rate', e.target.value)}
                                            className="w-full text-right text-sm"
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 text-right text-sm w-32">
                                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: item.currency }).format(item.total)}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 text-center w-16">
                                        <Button 
                                            type="link" 
                                            danger 
                                            onClick={() => handleRemoveItem(index)}
                                            icon={<DeleteOutlined />}
                                            size="small"
                                        >
                                            Sil
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/quotes')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600"
                    >
                        Kaydet
                    </button>
                </div>
            </Form>

                {/* Ürün/Hizmet Ekleme Modal */}
                {showProductForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div 
                            className="bg-white rounded-lg p-6 w-[1000px] max-h-[90vh] overflow-y-auto relative"
                            style={{
                                transform: `translate(${productModalPosition.x}px, ${productModalPosition.y}px)`,
                                transition: productModalDragging ? 'none' : 'transform 0.1s',
                                cursor: productModalDragging ? 'grabbing' : 'auto'
                            }}
                        >
                            <div 
                                className="flex justify-between items-center mb-4 cursor-grab"
                                onMouseDown={handleProductModalMouseDown}
                                style={{ cursor: productModalDragging ? 'grabbing' : 'grab' }}
                            >
                                <h3 className="text-lg font-medium text-gray-900 select-none">Ürün/Hizmet Ekle</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowProductForm(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="relative">
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => handleCategoryChange(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="">Kategori Seçin</option>
                                            <option value="1">Gergi Tavan</option>
                                            <option value="2">Hizmet</option>
                                            <option value="3">LED</option>
                                            <option value="4">Yedek Parça</option>
                                            <option value="5">Trafo</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Ürün Adı</label>
                                            <select
                                            value={selectedProduct.name}
                                            onChange={(e) => handleNameSelect(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            disabled={!selectedCategory}
                                        >
                                            <option value="">Ad Seçin</option>
                                            {filteredProducts.map(product => (
                                                <option key={product.id} value={product.name}>
                                                    {product.name}
                                                </option>
                                            ))}
                                            </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Ürün Kodu</label>
                                            <select
                                            value={selectedProduct.code}
                                            onChange={(e) => handleCodeSelect(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            disabled={!selectedProduct.name}
                                        >
                                            <option value="">Kod Seçin</option>
                                            {productCodes.map(product => (
                                                <option key={product.id} value={product.code}>
                                                    {product.code}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                {selectedCategory === "1" && (
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowCustomSizeModal(true)}
                                            className="bg-orange-100 text-orange-600 px-6 py-2 rounded-md hover:bg-orange-200 text-sm font-medium"
                                        >
                                            Özel Ölçü
                                        </button>
                                    </div>
                                )}

                                {/* Ürün ekleme modalindeki hesaplama tablosu */}
                                {selectedProduct.calculatedItems.length > 0 && (
                                    <div className="border border-gray-200 rounded-md overflow-hidden mt-4">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ölçüler</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Adet</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Miktar</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Birim</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedProduct.calculatedItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{item.amount.toFixed(2)}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{item.unit}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowProductForm(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                            handleAddProduct(selectedProduct);
                                                setShowProductForm(false);
                                            }}
                                        disabled={!selectedProduct.code}
                                            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Ekle
                                        </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* Özel Ölçü Modal */}
            {showCustomSizeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div 
                        className="bg-white rounded-lg p-6 w-[800px] relative"
                        style={{
                            transform: `translate(${customSizeModalPosition.x}px, ${customSizeModalPosition.y}px)`,
                            transition: customSizeModalDragging ? 'none' : 'transform 0.1s',
                            cursor: customSizeModalDragging ? 'grabbing' : 'auto'
                        }}
                    >
                        <div 
                            className="flex justify-between items-center mb-4 cursor-grab"
                            onMouseDown={handleCustomSizeModalMouseDown}
                            style={{ cursor: customSizeModalDragging ? 'grabbing' : 'grab' }}
                        >
                            <h3 className="text-lg font-medium text-gray-900 select-none">Özel Ölçü Girişi</h3>
                            <button
                                type="button"
                                onClick={() => setShowCustomSizeModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">
                                Excel'den kopyaladığınız verileri aşağıdaki tabloya yapıştırabilir veya manuel olarak girebilirsiniz.
                            </p>
                            <div className="border border-gray-300 rounded-md overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border-b border-r px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">En (cm)</th>
                                            <th className="border-b border-r px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Boy (cm)</th>
                                            <th className="border-b border-r px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Adet</th>
                                            <th className="border-b border-r px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Alan (m²)</th>
                                            <th className="border-b px-4 py-2 w-16"></th>
                                </tr>
                            </thead>
                                    <tbody className="bg-white" onPaste={handlePaste}>
                                        {customSizeData.map((row, rowIndex) => (
                                            <tr key={rowIndex} className="border-b last:border-b-0">
                                                {row.map((cell, cellIndex) => (
                                                    <td key={cellIndex} className="border-r p-0 last:border-r-0">
                                                        {cellIndex === 3 ? (
                                                            // Alan hücresi - salt okunur
                                                            <input
                                                                type="text"
                                                                value={cell}
                                                                readOnly
                                                                className="w-full px-4 py-2 bg-gray-50"
                                                            />
                                                        ) : (
                                                            // Diğer hücreler - düzenlenebilir
                                                            <input
                                                                type="number"
                                                                value={cell}
                                                                onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                                                                className="w-full px-4 py-2 focus:outline-none focus:bg-orange-50"
                                                                min={cellIndex === 2 ? "1" : "0"}
                                                                step={cellIndex === 2 ? "1" : "0.1"}
                                                                placeholder={cellIndex === 2 ? "Adet" : "0.00"}
                                                            />
                                                        )}
                                        </td>
                                                ))}
                                                <td className="px-2 py-1 text-center">
                                            <button
                                                type="button"
                                                        onClick={() => handleRemoveRow(rowIndex)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                        ×
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                            <button
                                type="button"
                                onClick={handleAddRow}
                                className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                            >
                                + Yeni Satır Ekle
                            </button>
                        </div>

                        {/* Kaydet butonu öncesi toplam hesaplama */}
                        <div className="mt-4 text-right text-sm text-gray-600">
                            Toplam Alan: {customSizeData.reduce((sum, row) => {
                                const en = parseFloat(row[0]) || 0;
                                const boy = parseFloat(row[1]) || 0;
                                const adet = parseInt(row[2]) || 0;
                                return sum + (en * boy * adet);
                            }, 0).toFixed(2)} m²
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                                onClick={() => setShowCustomSizeModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        İptal
                    </button>
                    <button
                                type="button"
                                onClick={handleSaveCustomSize}
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600"
                    >
                        Kaydet
                    </button>
                </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuoteForm; 