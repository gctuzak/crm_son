const request = require('supertest');
const app = require('../src/app');
const path = require('path');
const { connect, disconnect } = require('../src/config/database');
const UserService = require('../src/services/UserService');
const CompanyService = require('../src/services/CompanyService');

describe('File Tests', () => {
    let authToken;
    let testUser;
    let testCompany;

    beforeAll(async () => {
        await connect();
        
        // Test kullanıcısını oluştur
        testUser = await UserService.create({
            first_name: 'Test',
            last_name: 'User',
            email: 'test.file@example.com',
            password: 'Test123!',
            role: 'admin'
        });

        // Test şirketini oluştur
        testCompany = await CompanyService.create({
            name: 'Test Şirketi Ltd.',
            type: 'limited',
            tax_number: '1234567890',
            phone: '+90 555 123 4567',
            address: 'Test Adres'
        });

        // Giriş yap ve token al
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'test.file@example.com',
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

    describe('POST /files/:entityType/:entityId', () => {
        it('dosya yüklemeli', async () => {
            const response = await request(app)
                .post(`/files/company/${testCompany.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .attach('file', 'tests/test-files/test.pdf');

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.file).toHaveProperty('id');
        });

        it('desteklenmeyen dosya türünü reddetmeli', async () => {
            const response = await request(app)
                .post(`/files/company/${testCompany.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .attach('file', 'tests/test-files/test.exe');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /files', () => {
        it('entity dosyalarını getirmeli', async () => {
            const response = await request(app)
                .get(`/files/company/${testCompany.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data.files)).toBe(true);
        });

        it('dosya detaylarını getirmeli', async () => {
            const uploadResponse = await request(app)
                .post(`/files/company/${testCompany.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .attach('file', 'tests/test-files/test.pdf');

            const fileId = uploadResponse.body.data.file.id;

            const response = await request(app)
                .get(`/files/${fileId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.file.id).toBe(fileId);
        });
    });

    describe('DELETE /files/:id', () => {
        it('dosyayı silmeli', async () => {
            const uploadResponse = await request(app)
                .post(`/files/company/${testCompany.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .attach('file', 'tests/test-files/test.pdf');

            const fileId = uploadResponse.body.data.file.id;

            const response = await request(app)
                .delete(`/files/${fileId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
}); 