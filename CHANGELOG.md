# Değişiklik Günlüğü

Tüm önemli değişiklikler bu dosyada belgelenecektir.

## [1.0.9] - 2024-03-21

### Değişiklikler
- Aktivite türleri listesi güncellendi
- Yeni aktivite türleri eklendi:
  - Cari Hesap Bilgileri
  - Fatura kesilecek
  - Gelen eposta
  - Giden eposta
  - İmalat
  - İşemri oluşturulacak
  - Keşif
  - Montaj
  - Müşteri ziyaret
  - Numune gönderimi
  - Prim Hakedişi
  - Proje çizim
  - Proje İnceleme
  - Sevkiyat
  - Şikayet/Arıza/Servis kaydı
  - Tahsilat Takibi
  - Teklif Durum Takibi
  - Teklif Gönderim Onayı
  - Teklif Onay Talebi
  - Teklif verilecek
  - Teknik Servis
  - Telefon görüşmesi
  - Toplantı
  - Toplu eposta

## [1.0.6] - 2024-03-21

### Değişiklikler
- Sidebar menü düzeni güncellendi
- Menü öğelerinin sıralaması değiştirildi
- Material Icons eklenerek menü öğelerine ikonlar eklendi
- Dashboard menü başlığı "Ana Menü" olarak güncellendi

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

## [1.0.7] - 2024-03-21

### Değişiklikler
- Aktivite formunda ilişki/müşteri arama alanı iyileştirildi
  - Hem kişiler hem de şirketler aynı arama kutusunda aranabilir hale getirildi
  - Kişiler ve şirketler ayrı başlıklar altında listelendi
  - Şirketler doğrudan seçilebilir hale getirildi

## [1.0.8] - 2024-03-21

### Eklenenler
- Şirket detay kartı eklendi
- Şirket listesinde şirket adına tıklandığında detay kartı açılması sağlandı
- Şirket detay kartında temel bilgiler, iletişim bilgileri, yetkili bilgileri ve diğer bilgiler bölümleri eklendi
- E-posta ve telefon numaraları tıklanabilir bağlantılar olarak düzenlendi

### Teknik İyileştirmeler
- Tarih formatlaması için native JavaScript toLocaleDateString kullanımına geçildi
- Modal dışına tıklandığında kapanma özelliği eklendi
- Responsive tasarım iyileştirmeleri yapıldı
- Boş alanlar için tutarlı gösterim ("-" işareti) sağlandı 