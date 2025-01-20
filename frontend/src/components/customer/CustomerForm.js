import React, { useState } from 'react';
import PersonForm from '../person/PersonForm';
import CompanyForm from '../company/CompanyForm';

const CustomerForm = () => {
    const [formType, setFormType] = useState('company');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Yeni İlişki/Müşteri</h2>
                <div className="relative inline-flex rounded-full border-2 border-gray-200">
                    <div 
                        className="absolute top-0 left-0 h-full transition-transform duration-200 ease-in-out"
                        style={{
                            width: '50%',
                            transform: formType === 'person' ? 'translateX(0)' : 'translateX(100%)',
                            background: '#2563eb',
                            borderRadius: '9999px',
                        }}
                    />
                    <label className="relative z-10 cursor-pointer">
                        <input
                            type="radio"
                            name="form_type"
                            value="person"
                            checked={formType === 'person'}
                            onChange={(e) => setFormType(e.target.value)}
                            className="sr-only"
                        />
                        <span className={`inline-block px-8 py-2 text-sm font-medium transition-colors ${
                            formType === 'person' ? 'text-white' : 'text-gray-700'
                        }`}>
                            Kişi
                        </span>
                    </label>
                    <label className="relative z-10 cursor-pointer">
                        <input
                            type="radio"
                            name="form_type"
                            value="company"
                            checked={formType === 'company'}
                            onChange={(e) => setFormType(e.target.value)}
                            className="sr-only"
                        />
                        <span className={`inline-block px-8 py-2 text-sm font-medium transition-colors ${
                            formType === 'company' ? 'text-white' : 'text-gray-700'
                        }`}>
                            Şirket/Kurum
                        </span>
                    </label>
                </div>
            </div>

            {formType === 'company' ? <CompanyForm /> : <PersonForm />}
        </div>
    );
};

export default CustomerForm; 