import React, { useState, useEffect } from 'react';
import { statsService } from '../../services/api';
import { OrdersChart } from './OrdersChart';
import { ActivityChart } from './ActivityChart';
import { PerformanceGauge } from './PerformanceGauge';
import { MapContainer } from './MapContainer';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        persons: 0,
        companies: 0,
        files: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            console.log('Dashboard: Stats verisi isteniyor...');
            const response = await statsService.getDashboardStats();
            
            if (!response || !response.data) {
                throw new Error('API yanıtı alınamadı');
            }

            console.log('Stats yanıtı:', response.data);
            
            if (response.data.success && response.data.stats) {
                setStats(response.data.stats);
            } else {
                throw new Error('Geçersiz API yanıtı');
            }
        } catch (error) {
            console.error('Dashboard hatası:', error);
            setError(`Veriler yüklenirken bir hata oluştu: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">CRM ITEM Dashboard</h1>
            </div>

            {/* ÖZET TABLOLAR / GRAFİKLER */}
            <div>
                <h2 className="text-base font-medium mb-4">ÖZET TABLOLAR / GRAFİKLER</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Toplam Kişi</h3>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.persons}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Toplam Şirket</h3>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.companies}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Toplam Dosya</h3>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.files}</p>
                    </div>
                </div>
            </div>

            {/* PERFORMANS GÖSTERGELERİ */}
            <div>
                <h2 className="text-base font-medium mb-4">PERFORMANS GÖSTERGELERİ</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <PerformanceGauge title="Müşteri Memnuniyeti" value={85} />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <PerformanceGauge title="Hedef Gerçekleştirme" value={92} />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <PerformanceGauge title="Büyüme Oranı" value={78} />
                    </div>
                </div>
            </div>

            {/* GRAFİKLER */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Aylık Siparişler</h3>
                    <OrdersChart />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Aktivite Analizi</h3>
                    <ActivityChart />
                </div>
            </div>

            {/* HARİTA */}
            <div>
                <h2 className="text-base font-medium mb-4">KONUM ANALİZİ</h2>
                <div className="bg-white p-4 rounded-lg shadow">
                    <MapContainer />
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 