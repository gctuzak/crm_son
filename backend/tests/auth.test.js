const request = require('supertest');
const app = require('../src/app');
const { createTables } = require('../src/config/migrations');

describe('Auth Tests', () => {
    let testUser;
    let testEmail;

    beforeEach(async () => {
        await createTables();
        testEmail = `test${Date.now()}@example.com`;
        testUser = {
            email: testEmail,
            password: 'Test123!',
            first_name: 'Test',
            last_name: 'User'
        };
    });

    describe('POST /auth/login', () => {
        it('başarılı giriş yapmalı', async () => {
            // Önce kullanıcıyı oluştur
            await request(app)
                .post('/auth/register')
                .send(testUser);

            // Giriş yap
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: testEmail,
                    password: 'Test123!'
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data).toHaveProperty('user');
        });

        it('hatalı şifre ile giriş yapmamalı', async () => {
            // Önce kullanıcıyı oluştur
            await request(app)
                .post('/auth/register')
                .send(testUser);

            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: testEmail,
                    password: 'WrongPass123!'
                });

            expect(response.status).toBe(401);
        });

        it('olmayan kullanıcı ile giriş yapmamalı', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'Test123!'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('POST /auth/register', () => {
        it('yeni kullanıcı kaydı yapmalı', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send(testUser);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data.user).toHaveProperty('email', testEmail);
        });

        it('var olan email ile kayıt yapmamalı', async () => {
            // İlk kullanıcıyı oluştur
            await request(app)
                .post('/auth/register')
                .send(testUser);

            // Aynı email ile tekrar kayıt olmayı dene
            const response = await request(app)
                .post('/auth/register')
                .send(testUser);

            expect(response.status).toBe(400);
        });

        it('eksik bilgilerle kayıt yapmamalı', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: testEmail
                });

            expect(response.status).toBe(400);
        });
    });
}); 