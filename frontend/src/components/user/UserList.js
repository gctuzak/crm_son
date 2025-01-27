import React, { useState, useEffect } from 'react';
import { Table, Button, message, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import api from '../../services/api/api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data || []);
        } catch (error) {
            console.error('Kullanıcılar yüklenirken hata:', error);
            message.error('Kullanıcılar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            message.success('Kullanıcı başarıyla silindi');
            fetchUsers();
        } catch (error) {
            console.error('Kullanıcı silinirken hata:', error);
            message.error('Kullanıcı silinirken bir hata oluştu');
        }
    };

    const columns = [
        {
            title: 'Ad',
            dataIndex: 'first_name',
            key: 'first_name',
            sorter: (a, b) => a.first_name.localeCompare(b.first_name)
        },
        {
            title: 'Soyad',
            dataIndex: 'last_name',
            key: 'last_name',
            sorter: (a, b) => a.last_name.localeCompare(b.last_name)
        },
        {
            title: 'E-posta',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Kullanıcı Adı',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: 'İşlemler',
            key: 'actions',
            render: (_, record) => (
                <div className="flex space-x-2">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => console.log('Düzenle:', record.user_id)}
                    >
                        Düzenle
                    </Button>
                    <Popconfirm
                        title="Kullanıcıyı silmek istediğinize emin misiniz?"
                        onConfirm={() => handleDelete(record.user_id)}
                        okText="Evet"
                        cancelText="Hayır"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Sil
                        </Button>
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">KULLANICILAR</h2>
                <Button
                    type="primary"
                    onClick={() => console.log('Yeni kullanıcı ekle')}
                    className="bg-orange-500 hover:bg-orange-600 border-none"
                >
                    Yeni Kullanıcı Ekle
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="user_id"
                loading={loading}
                pagination={{
                    total: users.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Toplam ${total} kayıt`
                }}
            />
        </div>
    );
};

export default UserList; 