const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Tüm kullanıcıları getir
router.get('/', async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            orderBy: {
                created_at: 'desc'
            }
        });
        res.json(users);
    } catch (error) {
        console.error('Kullanıcılar getirilirken hata:', error);
        res.status(500).json({ error: 'Kullanıcılar getirilirken bir hata oluştu' });
    }
});

// Kullanıcı ekle
router.post('/', async (req, res) => {
    try {
        const user = await prisma.users.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        res.json(user);
    } catch (error) {
        console.error('Kullanıcı eklenirken hata:', error);
        res.status(500).json({ error: 'Kullanıcı eklenirken bir hata oluştu' });
    }
});

// Kullanıcı güncelle
router.put('/:id', async (req, res) => {
    try {
        const user = await prisma.users.update({
            where: { user_id: parseInt(req.params.id) },
            data: {
                username: req.body.username,
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                updated_at: new Date()
            }
        });
        res.json(user);
    } catch (error) {
        console.error('Kullanıcı güncellenirken hata:', error);
        res.status(500).json({ error: 'Kullanıcı güncellenirken bir hata oluştu' });
    }
});

// Kullanıcı sil
router.delete('/:id', async (req, res) => {
    try {
        await prisma.users.delete({
            where: { user_id: parseInt(req.params.id) }
        });
        res.json({ message: 'Kullanıcı başarıyla silindi' });
    } catch (error) {
        console.error('Kullanıcı silinirken hata:', error);
        res.status(500).json({ error: 'Kullanıcı silinirken bir hata oluştu' });
    }
});

module.exports = router; 