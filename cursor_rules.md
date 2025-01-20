# Geliştirme Kuralları

## PowerShell Komut Kuralları

1. **Komut Ayırıcıları:**
   - && yerine ; kullanılmalı
   - Her komut yeni satırda yazılabilir
   - Pipeline operatörü (|) kullanılabilir

2. **Doğru Kullanım Örnekleri:**
   ```powershell
   # YANLIŞ
   cd frontend && npm install

   # DOĞRU - Yöntem 1
   cd frontend; npm install

   # DOĞRU - Yöntem 2
   cd frontend
   npm install
   ```

3. **Hata Yönetimi:**
   ```powershell
   try {
       cd frontend; npm install
   } catch {
       Write-Error "Hata: $_"
   }
   ```

## Frontend Geliştirme Süreci

1. **Form Tasarımı:**
   - Önce form tasarımı yapılır ve gerekli alanlar belirlenir
   - Form alanları için validasyon kuralları oluşturulur
   - Form state yönetimi için gerekli yapı kurulur

2. **Veri Modeli:**
   - Form alanlarına uygun database yapısı planlanır
   - İlişkiler ve foreign key'ler belirlenir
   - İndeks gerektiren alanlar tespit edilir

3. **Database Güncelleme:**
   - Her form değişikliğinde database.md dosyası güncellenir
   - Yeni alanlar ve ilişkiler dokümante edilir
   - Gerekli indeksler eklenir

## Database Geliştirme Süreci

1. **Tablo Oluşturma:**
   - database.md dosyasındaki yapıya göre tablolar oluşturulur
   - İndeksler ve foreign key'ler eklenir
   - Veri bütünlüğü kontrolleri yapılır

2. **Veri Doğrulama:**
   - ENUM ve CHECK kısıtlamaları eklenir
   - NOT NULL ve DEFAULT değerler belirlenir
   - Unique key'ler tanımlanır

3. **İlişki Yönetimi:**
   - Foreign key'ler için ON DELETE ve ON UPDATE davranışları belirlenir
   - Çoktan-çoğa ilişkiler için ara tablolar oluşturulur
   - Polymorphic ilişkiler için entity_type alanları eklenir

## Genel Kurallar

1. **Kod Organizasyonu:**
   - Frontend kodları /frontend altında
   - Backend kodları /backend altında
   - Database scriptleri /database altında tutulur

2. **İsimlendirme:**
   - Tablo isimleri PascalCase (Companies, Persons)
   - Kolon isimleri snake_case (first_name, tax_number)
   - Frontend komponent isimleri PascalCase (CustomerForm, CompanyList)

3. **Dokümantasyon:**
   - Her değişiklik database.md'ye işlenir
   - Kompleks sorgular için SQL örnekleri eklenir
   - API endpoint'leri dokümante edilir

4. **Güvenlik:**
   - Hassas veriler şifrelenir
   - Kullanıcı yetkilendirmesi yapılır
   - Input validasyonu hem frontend hem backend'de yapılır

## Kod Değişikliği Kontrol Listesi

### Değişiklik Öncesi:
- [ ] İlgili tüm dosyaları incele
- [ ] Database yapısını kontrol et
- [ ] Mevcut validasyonları kontrol et
- [ ] İlişkili komponentleri belirle

### Değişiklik Sırası:
- [ ] Önce database.md'yi güncelle
- [ ] Sonra form yapısını güncelle
- [ ] Validasyonları ekle/güncelle
- [ ] İlişkili komponentleri güncelle

### Değişiklik Sonrası:
- [ ] Database uyumluluğunu kontrol et
- [ ] Form validasyonlarını test et
- [ ] İlişkili komponentlerin çalışmasını kontrol et
- [ ] Hata durumlarını test et

### Bağımlılık Kontrolü:
- [ ] Props geçişlerini kontrol et
- [ ] Event handler'ları kontrol et
- [ ] State yönetimini kontrol et
- [ ] API entegrasyonlarını kontrol et

## Form Oluşturma:
- [ ] Form alanları belirlendi
- [ ] Validasyon kuralları eklendi
- [ ] State yönetimi kuruldu
- [ ] API bağlantıları yapıldı

## Database Güncelleme:
- [ ] Tablo yapısı güncellendi
- [ ] İndeksler eklendi
- [ ] Foreign key'ler tanımlandı
- [ ] database.md güncellendi

## Test:
- [ ] Form validasyonları test edildi
- [ ] API çağrıları test edildi
- [ ] Database sorguları test edildi
- [ ] Hata durumları kontrol edildi 