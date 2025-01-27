import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    
    const menuItems = [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/activities', icon: '⏰', label: 'Aktivite / Görev' },
        { path: '/quotes', icon: '📄', label: 'Teklif' },
        { path: '/orders', icon: '📦', label: 'Sipariş' },
        { path: '/products', icon: '🏷️', label: 'Ürünler' },
        { path: '/persons', icon: '👥', label: 'Müşteriler' },
        { path: '/files', icon: '📁', label: 'Dosyalar' },
        { path: '/users', icon: '👤', label: 'Kullanıcılar' }
    ];

    return (
        <aside className="bg-white w-64 min-h-screen shadow-sm">
            <nav className="mt-6">
                <div className="space-y-2 px-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-colors ${
                                location.pathname === item.path ? 'bg-orange-50 text-orange-500' : ''
                            }`}
                        >
                            <span className="text-xl mr-3">{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar; 