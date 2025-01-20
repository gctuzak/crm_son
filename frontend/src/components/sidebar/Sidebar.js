import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/activities', icon: '⏰', label: 'Aktivite / Görev' },
        { path: '/quotes', icon: '📄', label: 'Teklif' },
        { path: '/orders', icon: '📦', label: 'Sipariş' },
        { path: '/persons', icon: '👥', label: 'Kişiler' },
        { path: '/products', icon: '🛍️', label: 'Ürün / Hizmet' },
        { path: '/files', icon: '📁', label: 'Dosyalar' },
        { path: '/users', icon: '👤', label: 'Kullanıcılar' }
    ];

    return (
        <aside className="bg-white w-64 min-h-screen border-r border-gray-200">
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">CRM</h2>
            </div>
            <nav className="mt-4">
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`flex items-center px-4 py-2 text-sm font-medium ${
                            location.pathname === item.path
                                ? 'text-orange-600 bg-orange-50'
                                : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar; 