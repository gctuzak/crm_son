const request = require('supertest');
const app = require('../src/app');
const fs = require('fs');
const path = require('path');
const { createTables } = require('../src/config/migrations');

describe('File Tests', () => {
    let testFilePath;
    let authToken;

    beforeEach(async () => {
        await createTables();

        // Test dosyası oluştur
        testFilePath = path.join(__dirname, 'test.txt');
        fs.writeFileSync(testFilePath, 'Test içeriği');

        // Test kullanıcısı oluştur ve giriş yap
        const testUser = {
            email: `test${Date.now()}@example.com`,
            password: 'test123',
            first_name: 'Test',
            last_name: 'User'
        };

        await request(app)
            .post('/auth/register')
            .send(testUser);

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        authToken = loginResponse.body.data.token;
    });

    afterEach(() => {
        // Test dosyasını temizle
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    });

    describe('POST /files/:entityType/:entityId', () => {
        it('dosya yüklemeli', async () => {
            const response = await request(app)
                .post('/files/test/1')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('file', testFilePath);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('original_name', 'test.txt');
        });

        it('desteklenmeyen dosya türünü reddetmeli', async () => {
            // Executable dosya oluştur
            const executablePath = path.join(__dirname, 'test.exe');
            fs.writeFileSync(executablePath, 'Test içeriği');

            const response = await request(app)
                .post('/files/test/1')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('file', executablePath);

            expect(response.status).toBe(400);

            // Temizlik
            if (fs.existsSync(executablePath)) {
                fs.unlinkSync(executablePath);
            }
        });
    });

    describe('GET /files', () => {
        it('dosyaları listelemeli', async () => {
            // Önce bir dosya yükle
            await request(app)
                .post('/files/test/1')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('file', testFilePath);

            const response = await request(app)
                .get('/files')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('dosya detaylarını getirmeli', async () => {
            // Önce bir dosya yükle
            const uploadResponse = await request(app)
                .post('/files/test/1')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('file', testFilePath);

            const fileId = uploadResponse.body.data.id;

            const response = await request(app)
                .get(`/files/${fileId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('id', fileId);
        });
    });

    describe('DELETE /files/:id', () => {
        it('dosyayı silmeli', async () => {
            // Önce bir dosya yükle
            const uploadResponse = await request(app)
                .post('/files/test/1')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('file', testFilePath);

            const fileId = uploadResponse.body.data.id;

            const response = await request(app)
                .delete(`/files/${fileId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
}); 