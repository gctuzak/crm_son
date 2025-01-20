# Version Log

## Version 1.0.0 (2024-01-19)

### PersonList.js
```javascript
- Tablo yapısında liste görünümü
- Kolonlar:
  * ID (w-24)
  * İsim (w-48)
  * Soyisim (w-48)
  * TC Kimlik (w-48)
  * Telefon (w-36)
  * Tip (w-32)
  * Şehir (w-32)
  * Şirket (w-48)
  * İşlemler (w-32)
- Her satır için düzenle ve sil butonları
- Toplam kayıt sayısı gösterimi
- API entegrasyonu (personService.getAll())
- Silme işlemi için onay penceresi
```

### PersonForm.js
```javascript
- Form alanları:
  * İsim (required)
  * Soyisim (required)
  * TC Kimlik No (required)
  * E-posta (required)
  * Telefon (required)
  * Şehir
  * Tip (select: employee, customer, supplier)
  * Şirket (select, API'den gelen liste)
  * Adres (textarea)
- API entegrasyonları:
  * companyService.getAll() - Şirket listesi
  * personService.getById() - Kişi detayı
  * personService.create() - Yeni kayıt
  * personService.update() - Güncelleme
- Hata yönetimi ve validasyonlar
- Responsive tasarım (Tailwind CSS)
```

### API Servisleri
```javascript
personService:
- getAll()
- getById(id)
- create(data)
- update(id, data)
- delete(id)

companyService:
- getAll() - Şirket listesi için
```

### Önemli Notlar
- Tüm bileşenler 'use client' direktifi ile client-side rendering kullanıyor
- React Router entegrasyonu mevcut
- Tailwind CSS ile stil yönetimi
- API yanıtları için hata yönetimi
- Responsive tasarım
- Form validasyonları
- Kullanıcı dostu arayüz 