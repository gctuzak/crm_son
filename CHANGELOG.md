# Değişiklik Günlüğü

Tüm önemli değişiklikler bu dosyada belgelenecektir.

## [1.0.5] - 2024-03-21

### Değişiklikler
- Şirket ve kişi formlarında iptal butonlarının yönlendirme adresleri düzeltildi
- Şirket ve kişi formlarında başarılı kayıt sonrası yönlendirme adresleri düzeltildi
- Form iptal butonları artık ilgili sekmelere yönlendiriyor (kişiler için /customers?tab=persons, şirketler için /customers?tab=companies)

## [1.0.1] - 2024-03-18

### Eklenen
- Temel CRUD işlemleri
- Kişi yönetimi için API yolları
- Frontend için kişi listeleme ve silme işlevleri
- Hata yönetimi ve loglama
- Temel veritabanı işlemleri

### Değiştirilen
- BaseService sınıfında hata yönetimi iyileştirildi
- Frontend'de kişi listeleme görünümü güncellendi

### Düzeltilen
- Silme işlemindeki hata yönetimi düzeltildi
- API yanıtlarında tutarlılık sağlandı

### Güvenlik
- Temel güvenlik kontrolleri eklendi
- Hata mesajlarında hassas bilgilerin gösterilmesi engellendi

## [1.0.4] - 2024-03-21

### Değişiklikler
- Şirket listesine ve formuna email alanı eklendi
- Şirket güncelleme işlemindeki email alanı hatası düzeltildi
- Kişi listesinde email alanı tıklanabilir hale getirildi (mailto: desteği)
- Kişi ve şirket formlarında 2 sütunlu tasarıma geçildi
- Form iptal butonlarındaki yönlendirme sorunları giderildi

### Teknik İyileştirmeler
- Companies tablosunda email alanı array tipinden varchar(255) tipine dönüştürüldü
- Form veri gönderim formatları optimize edildi
- Boş alan kontrolleri iyileştirildi 