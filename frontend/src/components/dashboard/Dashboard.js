'use client';

import React, { useState, useEffect } from 'react';
import { statsService } from '../../services/statsService';
import { OrdersChart } from './OrdersChart';
import { ActivityChart } from './ActivityChart';
import { PerformanceGauge } from './PerformanceGauge';
import { MapContainer } from './MapContainer';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await statsService.getDashboardStats();
                console.log('Dashboard yanıtı:', response);
                
                if (response.success) {
                    setStats(response.data);
                } else {
                    setError(response.error);
                }
            } catch (err) {
                console.error('Dashboard hatası:', err);
                setError('İstatistikler alınamadı');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 rounded-md bg-red-50 border border-red-200">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200">
                <p className="text-yellow-600">Henüz istatistik verisi yok</p>
            </div>
        );
    }

    // Stats verilerini kontrol etmek için
    console.log('Görüntülenecek stats:', stats);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Kişi İstatistikleri */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Kişi İstatistikleri</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Toplam Kişi:</span>
                            <span className="font-medium">{stats.stats?.persons || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Aktif Kişi:</span>
                            <span className="font-medium">{stats.stats?.persons || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Şirket İstatistikleri */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Şirket İstatistikleri</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Toplam Şirket:</span>
                            <span className="font-medium">{stats.stats?.companies || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Aktif Şirket:</span>
                            <span className="font-medium">{stats.stats?.companies || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Aktivite İstatistikleri */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivite İstatistikleri</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Toplam Aktivite:</span>
                            <span className="font-medium">0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Bekleyen Aktivite:</span>
                            <span className="font-medium">0</span>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-6">ÖZET TABLOLAR / GRAFİKLER</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-base font-medium text-gray-500 mb-2">Toplam Kişi</h3>
                    <p className="text-3xl font-semibold">{stats.stats?.persons || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-base font-medium text-gray-500 mb-2">Toplam Şirket</h3>
                    <p className="text-3xl font-semibold">{stats.stats?.companies || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-base font-medium text-gray-500 mb-2">Toplam Dosya</h3>
                    <p className="text-3xl font-semibold">{stats.stats?.files || 0}</p>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-6">PERFORMANS GÖSTERGELERİ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-base font-medium text-gray-500 mb-2">Müşteri Memnuniyeti</h3>
                    <p className="text-3xl font-semibold">0%</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-base font-medium text-gray-500 mb-2">Hedef Gerçekleştirme</h3>
                    <p className="text-3xl font-semibold">0%</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-base font-medium text-gray-500 mb-2">Büyüme Oranı</h3>
                    <p className="text-3xl font-semibold">0%</p>
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