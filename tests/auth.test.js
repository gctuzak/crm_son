const request = require('supertest');
const app = require('../src/app');
const { connect, disconnect } = require('../src/config/database');
const UserService = require('../src/services/UserService');

describe('Auth Tests', () => {
    let testUser;

    beforeAll(async () => {
        await connect();
        
        // Test kullanıcısını oluştur
        testUser = await UserService.create({
            first_name: 'Test',
            last_name: 'User',
            email: 'test.auth@example.com',
            password: 'Test123!',
            role: 'admin'
        });
    });

    afterAll(async () => {
        // Test kullanıcısını sil
        if (testUser?.id) {
            await UserService.delete(testUser.id);
        }
        await disconnect();
    });

    describe('POST /auth/login', () => {
        it('başarılı giriş yapmalı', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: 'Test123!'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data).toHaveProperty('user');
        });

        it('hatalı şifre ile giriş yapmamalı', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: 'WrongPass123!'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it('olmayan kullanıcı ile giriş yapmamalı', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'Test123!'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /auth/register', () => {
        it('yeni kullanıcı kaydı yapmalı', async () => {
            const newUser = {
                email: 'new@example.com',
                password: 'NewTest123!',
                first_name: 'New',
                last_name: 'User'
            };

            const response = await request(app)
                .post('/auth/register')
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data.user.email).toBe(newUser.email);
        });

        it('var olan email ile kayıt yapmamalı', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: testUser.email,
                    password: 'Test123!',
                    first_name: 'Test',
                    last_name: 'User'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('eksik bilgilerle kayıt yapmamalı', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'incomplete@example.com'
                });

            expect(response.status).toBe(422);
            expect(response.body.success).toBe(false);
        });
    });
}); 