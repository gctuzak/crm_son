const request = require('supertest');
const app = require('../src/app');
const { createTables } = require('../src/config/migrations');

describe('Person Tests', () => {
    let testUser;
    let authToken;
    let testEmail;
    let testIdentityNumber;

    beforeEach(async () => {
        await createTables();
        
        testEmail = `test${Date.now()}@example.com`;
        testIdentityNumber = `${Date.now()}`.slice(0, 11).padStart(11, '0');
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

    describe('POST /persons', () => {
        it('yeni kişi oluşturmalı', async () => {
            const response = await request(app)
                .post('/persons')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    first_name: 'New',
                    last_name: 'Person',
                    identity_number: testIdentityNumber,
                    email: 'newperson@example.com',
                    phone: '5551234567',
                    address: '123 Test St'
                });

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('id');
        });

        it('aynı kimlik numarası ile kişi oluşturmamalı', async () => {
            // İlk kişiyi oluştur
            await request(app)
                .post('/persons')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    first_name: 'First',
                    last_name: 'Person',
                    identity_number: testIdentityNumber,
                    email: 'first@example.com',
                    phone: '5551234567',
                    address: '123 Test St'
                });

            // Aynı kimlik numarası ile ikinci kişiyi oluşturmayı dene
            const response = await request(app)
                .post('/persons')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    first_name: 'Second',
                    last_name: 'Person',
                    identity_number: testIdentityNumber,
                    email: 'second@example.com',
                    phone: '5557654321',
                    address: '456 Test St'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /persons', () => {
        it('kişileri listelemeli', async () => {
            // Test kişisi oluştur
            await request(app)
                .post('/persons')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    first_name: 'Test',
                    last_name: 'Person',
                    identity_number: testIdentityNumber,
                    email: 'test.person@example.com',
                    phone: '5551234567',
                    address: '123 Test St'
                });

            const response = await request(app)
                .get('/persons')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('kişi detaylarını getirmeli', async () => {
            // Test kişisi oluştur
            const createResponse = await request(app)
                .post('/persons')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    first_name: 'Detail',
                    last_name: 'Person',
                    identity_number: testIdentityNumber,
                    email: 'detail@example.com',
                    phone: '5551234567',
                    address: '123 Test St'
                });

            const personId = createResponse.body.data.id;

            const response = await request(app)
                .get(`/persons/${personId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('id', personId);
        });
    });

    describe('PUT /persons/:id', () => {
        it('kişi bilgilerini güncellemeli', async () => {
            // Test kişisi oluştur
            const createResponse = await request(app)
                .post('/persons')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    first_name: 'Update',
                    last_name: 'Person',
                    identity_number: testIdentityNumber,
                    email: 'update@example.com',
                    phone: '5551234567',
                    address: '123 Test St'
                });

            const personId = createResponse.body.data.id;

            const response = await request(app)
                .put(`/persons/${personId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    first_name: 'Updated',
                    last_name: 'Person',
                    phone: '5559876543',
                    address: '456 Test St'
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('first_name', 'Updated');
        });
    });

    describe('DELETE /persons/:id', () => {
        it('kişiyi silmeli', async () => {
            // Test kişisi oluştur
            const createResponse = await request(app)
                .post('/persons')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    first_name: 'Delete',
                    last_name: 'Person',
                    identity_number: testIdentityNumber,
                    email: 'delete@example.com',
                    phone: '5551234567',
                    address: '123 Test St'
                });

            const personId = createResponse.body.data.id;

            const response = await request(app)
                .delete(`/persons/${personId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
        });
    });
}); 