const request = require('supertest');
const app = require('../src/app');
const { connect, disconnect } = require('../src/config/database');
const UserService = require('../src/services/UserService');
const CompanyService = require('../src/services/CompanyService');

describe('Company Tests', () => {
    let authToken;
    let testUser;
    let testCompany;

    beforeAll(async () => {
        await connect();
        
        // Test kullanıcısını oluştur
        testUser = await UserService.create({
            first_name: 'Test',
            last_name: 'User',
            email: 'test.company@example.com',
            password: 'Test123!',
            role: 'admin'
        });

        // Test şirketini oluştur
        testCompany = await CompanyService.create({
            name: 'Test Şirketi Ltd.',
            type: 'limited',
            tax_number: '1234567890',
            tax_office: 'Test Vergi Dairesi',
            address: 'Test Adres'
        });

        // Giriş yap ve token al
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'test.company@example.com',
                password: 'Test123!'
            });

        authToken = response.body.data.token;
    });

    afterAll(async () => {
        // Test verilerini temizle
        if (testCompany?.id) {
            await CompanyService.delete(testCompany.id);
        }
        if (testUser?.id) {
            await UserService.delete(testUser.id);
        }
        await disconnect();
    });

    describe('POST /companies', () => {
        it('yeni şirket oluşturmalı', async () => {
            const newCompany = {
                name: 'Test Şirketi A.Ş.',
                type: 'anonim',
                tax_number: '9876543210',
                tax_office: 'Merkez Vergi Dairesi',
                address: 'Merkez Mah. Test Sok. No:1'
            };

            const response = await request(app)
                .post('/companies')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newCompany);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.company).toHaveProperty('id');
        });

        it('aynı vergi numarası ile şirket oluşturmamalı', async () => {
            const response = await request(app)
                .post('/companies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Başka Şirket Ltd.',
                    type: 'limited',
                    tax_number: testCompany.tax_number,
                    tax_office: 'Başka Vergi Dairesi',
                    address: 'Başka Adres'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('eksik bilgilerle şirket oluşturmamalı', async () => {
            const response = await request(app)
                .post('/companies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Eksik Şirket'
                });

            expect(response.status).toBe(422);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /companies', () => {
        it('şirketleri listelemeli', async () => {
            const response = await request(app)
                .get('/companies')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data.companies)).toBe(true);
        });

        it('şirket detaylarını getirmeli', async () => {
            const response = await request(app)
                .get(`/companies/${testCompany.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.company.id).toBe(testCompany.id);
        });

        it('var olmayan şirket için 404 döndürmeli', async () => {
            const response = await request(app)
                .get('/companies/999999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /companies/:id', () => {
        it('şirket bilgilerini güncellemeli', async () => {
            const updates = {
                name: 'Güncellenmiş Şirket Ltd.',
                address: 'Güncellenmiş Adres'
            };

            const response = await request(app)
                .put(`/companies/${testCompany.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updates);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.company.name).toBe(updates.name);
        });

        it('vergi numarasını güncellememeyi', async () => {
            const response = await request(app)
                .put(`/companies/${testCompany.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    tax_number: '9876543210'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('DELETE /companies/:id', () => {
        it('şirketi silmeli', async () => {
            const newCompany = await request(app)
                .post('/companies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Silinecek Şirket',
                    type: 'limited',
                    tax_number: '1111111111',
                    tax_office: 'Test Vergi Dairesi',
                    address: 'Test Adres'
                });

            const response = await request(app)
                .delete(`/companies/${newCompany.body.data.company.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
}); 