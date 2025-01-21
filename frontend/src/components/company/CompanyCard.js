import React from 'react';

const CompanyCard = ({ company, isOpen, onClose }) => {
    if (!isOpen) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {company.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Temel Bilgiler */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                Temel Bilgiler
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Şirket Adı</label>
                                    <div className="mt-1 text-gray-900">{company.name}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Şirket Türü</label>
                                    <div className="mt-1 text-gray-900">{company.type || '-'}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Vergi Numarası</label>
                                    <div className="mt-1 text-gray-900">{company.tax_number || '-'}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Vergi Dairesi</label>
                                    <div className="mt-1 text-gray-900">{company.tax_office || '-'}</div>
                                </div>
                            </div>
                        </div>

                        {/* İletişim Bilgileri */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                İletişim Bilgileri
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">E-posta</label>
                                    <div className="mt-1">
                                        {company.email ? (
                                            <a href={`mailto:${company.email}`} className="text-blue-600 hover:text-blue-800">
                                                {company.email}
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Telefon</label>
                                    <div className="mt-1">
                                        {company.phone ? (
                                            <a href={`tel:${company.phone}`} className="text-blue-600 hover:text-blue-800">
                                                {company.phone}
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Adres</label>
                                    <div className="mt-1 text-gray-900">{company.address || '-'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Yetkili Bilgileri */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                Yetkili Bilgileri
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Yetkili Kişi</label>
                                    <div className="mt-1 text-gray-900">
                                        {company.representative_name || '-'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Yetkili Pozisyonu</label>
                                    <div className="mt-1 text-gray-900">
                                        {company.representative_position || '-'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Diğer Bilgiler */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                Diğer Bilgiler
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Notlar</label>
                                    <div className="mt-1 text-gray-900">{company.notes || '-'}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Oluşturulma Tarihi</label>
                                    <div className="mt-1 text-gray-900">{formatDate(company.created_at)}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Son Güncelleme</label>
                                    <div className="mt-1 text-gray-900">{formatDate(company.updated_at)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyCard; 