import React from 'react';

const PersonCard = ({ person, isOpen, onClose }) => {
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
                        {person.first_name} {person.last_name}
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
                        {/* Kişisel Bilgiler */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                Kişisel Bilgiler
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Ad</label>
                                    <div className="mt-1 text-gray-900">{person.first_name}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Soyad</label>
                                    <div className="mt-1 text-gray-900">{person.last_name}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Doğum Tarihi</label>
                                    <div className="mt-1 text-gray-900">{formatDate(person.birth_date)}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">TC Kimlik No</label>
                                    <div className="mt-1 text-gray-900">{person.identity_number || '-'}</div>
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
                                        {person.email ? (
                                            <a href={`mailto:${person.email}`} className="text-blue-600 hover:text-blue-800">
                                                {person.email}
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Telefon</label>
                                    <div className="mt-1">
                                        {person.phone ? (
                                            <a href={`tel:${person.phone}`} className="text-blue-600 hover:text-blue-800">
                                                {person.phone}
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Adres</label>
                                    <div className="mt-1 text-gray-900">{person.address || '-'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Şirket Bilgileri */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                Şirket Bilgileri
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Şirket</label>
                                    <div className="mt-1 text-gray-900">{person.company_name || '-'}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Departman</label>
                                    <div className="mt-1 text-gray-900">{person.department || '-'}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Ünvan</label>
                                    <div className="mt-1 text-gray-900">{person.title || '-'}</div>
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
                                    <div className="mt-1 text-gray-900">{person.notes || '-'}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Oluşturulma Tarihi</label>
                                    <div className="mt-1 text-gray-900">{formatDate(person.created_at)}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Son Güncelleme</label>
                                    <div className="mt-1 text-gray-900">{formatDate(person.updated_at)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonCard; 