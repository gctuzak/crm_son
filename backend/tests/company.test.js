const request = require('supertest');
const app = require('../src/app');
const { createTables } = require('../src/config/migrations');

describe('Company Tests', () => {
    let testUser;
    let authToken;
    let testEmail;
    let testTaxNumber;

    beforeEach(async () => {
        await createTables();
        testTaxNumber = `${Date.now()}`.slice(0, 10);
        
        testEmail = `test${Date.now()}@example.com`;
        testUser = {
            email: testEmail,
            password: 'Test123!',
            first_name: 'Test',
            last_name: 'User'
        };

        // Kullanıcı oluştur ve giriş yap
        await request(app)
            .post('/auth/register')
            .send(testUser);

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: testEmail,
                password: 'Test123!'
            });

        authToken = loginResponse.body.data.token;
    });

    describe('POST /companies', () => {
        it('yeni şirket oluşturmalı', async () => {
            const response = await request(app)
                .post('/companies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Test Company',
                    tax_number: testTaxNumber,
                    type: 'Limited',
                    sector: 'Technology',
                    city: 'Istanbul',
                    representative_id: 1
                });

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('id');
        });

        it('aynı vergi numarası ile şirket oluşturmamalı', async () => {
            // İlk şirketi oluştur
            await request(app)
                .post('/companies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'First Company',
                    tax_number: testTaxNumber,
                    type: 'Limited',
                    sector: 'Technology',
                    city: 'Istanbul',
                    representative_id: 1
                });

            // Aynı vergi numarası ile ikinci şirketi oluşturmayı dene
            const response = await request(app)
                .post('/companies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Second Company',
                    tax_number: testTaxNumber,
                    type: 'Limited',
                    sector: 'Technology',
                    city: 'Istanbul',
                    representative_id: 1
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /companies', () => {
        it('şirketleri listelemeli', async () => {
            // Test şirketi oluştur
            await request(app)
                .post('/companies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'List Company',
                    tax_number: testTaxNumber,
                    type: 'Limited',
                    sector: 'Technology',
                    city: 'Istanbul',
                    representative_id: 1
                });

            const response = await request(app)
                .get('/companies')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('şirket detaylarını getirmeli', async () => {
            // Test şirketi oluştur
            const createResponse = await request(app)
                .post('/companies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Detail Company',
                    tax_number: `${testTaxNumber}1`,
                    type: 'Limited',
                    sector: 'Technology',
                    city: 'Istanbul',
                    representative_id: 1
                });

            const companyId = createResponse.body.data.id;

            const response = await request(app)
                .get(`/companies/${companyId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('id', companyId);
        });
    });

    describe('PUT /companies/:id', () => {
        it('şirket bilgilerini güncellemeli', async () => {
            // Test şirketi oluştur
            const createResponse = await request(app)
                .post('/companies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Update Company',
                    tax_number: `${testTaxNumber}2`,
                    type: 'Limited',
                    sector: 'Technology',
                    city: 'Istanbul',
                    representative_id: 1
                });

            const companyId = createResponse.body.data.id;

            const response = await request(app)
                .put(`/companies/${companyId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Updated Company',
                    type: 'Corporation',
                    sector: 'Finance',
                    city: 'Ankara'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Updated Company');
        });
    });

    describe('DELETE /companies/:id', () => {
        it('şirketi silmeli', async () => {
            // Test şirketi oluştur
            const createResponse = await request(app)
                .post('/companies')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Delete Company',
                    tax_number: `${testTaxNumber}3`,
                    type: 'Limited',
                    sector: 'Technology',
                    city: 'Istanbul',
                    representative_id: 1
                });

            const companyId = createResponse.body.data.id;

            const response = await request(app)
                .delete(`/companies/${companyId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
        });
    });
}); 