const request = require('supertest');
const app = require('../src/app');
const { connect, disconnect } = require('../src/config/database');
const UserService = require('../src/services/UserService');
const PersonService = require('../src/services/PersonService');

describe('Person Tests', () => {
    let authToken;
    let testUser;
    let testPerson;

    beforeAll(async () => {
        await connect();
        
        // Test kullanıcısını oluştur
        testUser = await UserService.create({
            first_name: 'Test',
            last_name: 'User',
            email: 'test.user@example.com',
            password: 'Test123!',
            role: 'admin'
        });

        // Test kişisini oluştur
        testPerson = await PersonService.create({
            first_name: 'Test',
            last_name: 'Person',
            identity_number: '12345678901',
            email: 'test.person@example.com',
            phone: '5551234567'
        });

        // Giriş yap ve token al
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'test.user@example.com',
                password: 'Test123!'
            });

        authToken = response.body.data.token;
    });

    afterAll(async () => {
        // Test verilerini temizle
        if (testPerson?.id) {
            await PersonService.delete(testPerson.id);
        }
        if (testUser?.id) {
            await UserService.delete(testUser.id);
        }
        await disconnect();
    });

    describe('POST /persons', () => {
        it('yeni kişi oluşturmalı', async () => {
            const newPerson = {
                first_name: 'Ahmet',
                last_name: 'Yılmaz',
                identity_number: '98765432109',
                email: 'ahmet@example.com',
                phone: '5559876543'
            };

            const response = await request(app)
                .post('/persons')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newPerson);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.person).toHaveProperty('id');
        });

        it('aynı kimlik numarası ile kişi oluşturmamalı', async () => {
            const response = await request(app)
                .post('/persons')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    first_name: 'Mehmet',
                    last_name: 'Demir',
                    identity_number: testPerson.identity_number,
                    email: 'mehmet@example.com',
                    phone: '5557654321'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('eksik bilgilerle kişi oluşturmamalı', async () => {
            const response = await request(app)
                .post('/persons')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    first_name: 'Ayşe',
                    last_name: 'Kara'
                });

            expect(response.status).toBe(422);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /persons', () => {
        it('kişileri listelemeli', async () => {
            const response = await request(app)
                .get('/persons')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data.persons)).toBe(true);
        });

        it('kişi detaylarını getirmeli', async () => {
            const response = await request(app)
                .get(`/persons/${testPerson.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.person.id).toBe(testPerson.id);
        });

        it('var olmayan kişi için 404 döndürmeli', async () => {
            const response = await request(app)
                .get('/persons/999999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /persons/:id', () => {
        it('kişi bilgilerini güncellemeli', async () => {
            const updates = {
                first_name: 'Updated',
                last_name: 'Person',
                email: 'updated@example.com'
            };

            const response = await request(app)
                .put(`/persons/${testPerson.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updates);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.person.first_name).toBe(updates.first_name);
        });

        it('kimlik numarasını güncellememeyi', async () => {
            const response = await request(app)
                .put(`/persons/${testPerson.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    identity_number: '98765432109'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('DELETE /persons/:id', () => {
        it('kişiyi silmeli', async () => {
            const newPerson = await request(app)
                .post('/persons')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    first_name: 'Delete',
                    last_name: 'Test',
                    identity_number: '11111111111',
                    email: 'delete@example.com',
                    phone: '5551111111'
                });

            const response = await request(app)
                .delete(`/persons/${newPerson.body.data.person.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
}); 