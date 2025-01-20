import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileService } from '../../services/api';

const FileUpload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [entityType, setEntityType] = useState('');
    const [entityId, setEntityId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
                setError('Dosya boyutu 10MB\'dan büyük olamaz');
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Lütfen bir dosya seçin');
            return;
        }
        if (!entityType || !entityId) {
            setError('Lütfen varlık türü ve ID\'sini girin');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fileService.upload(entityType, entityId, formData);
            if (response.success) {
                navigate('/files');
            }
        } catch (error) {
            setError(error.message || 'Dosya yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="entityType" className="block text-sm font-medium text-gray-700">
                            Varlık Türü
                        </label>
                        <select
                            id="entityType"
                            value={entityType}
                            onChange={(e) => setEntityType(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="">Seçiniz</option>
                            <option value="person">Kişi</option>
                            <option value="company">Şirket</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="entityId" className="block text-sm font-medium text-gray-700">
                            Varlık ID
                        </label>
                        <input
                            type="text"
                            id="entityId"
                            value={entityId}
                            onChange={(e) => setEntityId(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                            Dosya
                        </label>
                        <input
                            type="file"
                            id="file"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            Maksimum dosya boyutu: 10MB
                        </p>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate('/files')}
                            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Yükleniyor...' : 'Yükle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FileUpload; 