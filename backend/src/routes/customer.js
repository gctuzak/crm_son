const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Müşteri arama (hem şirket hem kişi)
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        
        // Şirketlerde arama
        const companies = await prisma.companies.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                name: true,
                type: true,
                email: true,
                phone: true,
                tax_number: true
            }
        });

        // Kişilerde arama
        const persons = await prisma.persons.findMany({
            where: {
                OR: [
                    {
                        first_name: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        last_name: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                company_id: true
            }
        });

        // Sonuçları birleştir
        const results = [
            ...companies.map(c => ({
                ...c,
                displayName: c.name,
                type: 'company'
            })),
            ...persons.map(p => ({
                ...p,
                displayName: `${p.first_name} ${p.last_name}`,
                type: 'person'
            }))
        ];

        res.json(results);
    } catch (error) {
        console.error('Müşteri arama hatası:', error);
        res.status(500).json({ error: 'Müşteri arama sırasında bir hata oluştu' });
    }
});

// Şirkete bağlı kişileri getir
router.get('/company/:companyId/persons', async (req, res) => {
    try {
        const { companyId } = req.params;
        
        const persons = await prisma.persons.findMany({
            where: {
                company_id: parseInt(companyId)
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                company_id: true
            }
        });

        res.json(persons);
    } catch (error) {
        console.error('Şirket personeli getirme hatası:', error);
        res.status(500).json({ error: 'Şirket personeli getirilirken bir hata oluştu' });
    }
});

module.exports = router; 