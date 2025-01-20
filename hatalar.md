# Test Hataları (2024-03-19 14:30)

## Person Tests
- `TypeError: Cannot read properties of undefined (reading 'sendError')` - PersonController'da this.sendError tanımlı değil
- `TypeError: Cannot read properties of undefined (reading 'id')` - testPerson.id tanımlı değil
- Testler 10000ms timeout süresini aşıyor

## Company Tests  
- `TypeError: Cannot read properties of undefined (reading 'sendError')` - CompanyController'da this.sendError tanımlı değil
- `TypeError: Cannot read properties of undefined (reading 'id')` - testCompany.id tanımlı değil
- Testler 10000ms timeout süresini aşıyor

## Auth Tests
- HTTP status kodları yanlış:
  - Hatalı şifre: 500 yerine 401 olmalı
  - Kullanıcı bulunamadı: 500 yerine 401 olmalı 
  - Yeni kayıt: 500 yerine 201 olmalı
  - Email zaten kullanımda: 500 yerine 400 olmalı
  - Eksik bilgiler: 500 yerine 422 olmalı

## File Tests
- "users_email_key" unique constraint hatası - Test verisi oluşturma sorunu
- testCompany.id ve testUser.id tanımlı değil

## Genel Sorunlar
1. Controller'larda context (this) bağlama sorunu
2. Test verisi global olarak erişilebilir değil
3. Veritabanı bağlantısı açık kalıyor ve Jest kapanmıyor
4. HTTP status kodları standart değil

## Önerilen Çözümler
1. BaseController'da sendError ve sendSuccess metodlarını düzgün tanımla
2. Test verisini setup.js'de global olarak tanımla
3. Test sonrası veritabanı bağlantısını düzgün kapat
4. HTTP status kodlarını standartlaştır:
   - 201: Başarılı kayıt
   - 400: Geçersiz istek
   - 401: Yetkisiz erişim
   - 422: Validasyon hatası
   - 404: Bulunamadı 