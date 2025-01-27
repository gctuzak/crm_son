# CRM Item Yönetim Sistemi

## İçindekiler
- [Genel Bakış](#genel-bakış)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Kurulum](#kurulum)
- [Proje Yapısı](#proje-yapısı)
- [API Endpoints](#api-endpoints)
- [Frontend Bileşenleri](#frontend-bileşenleri)
- [Veritabanı Şeması](#veritabanı-şeması)
- [Özellikler](#özellikler)
- [Güvenlik](#güvenlik)
- [Deployment](#deployment)

## Genel Bakış

CRM Item, müşteri ilişkileri yönetimi için geliştirilmiş kapsamlı bir sistemdir. Şirketler ve kişiler için detaylı kayıt tutma, teklif oluşturma, ürün/hizmet yönetimi ve dosya yönetimi gibi temel özellikleri içerir.

### Temel Özellikler
- Şirket ve kişi yönetimi
- Teklif oluşturma ve takibi
- Ürün/hizmet kataloğu
- Dosya yönetimi
- İstatistikler ve raporlama
- Kullanıcı ve rol yönetimi

## Teknoloji Yığını

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- TypeScript

### Frontend
- React.js
- Next.js
- Ant Design
- Tailwind CSS
- TypeScript

### Araçlar ve Kütüphaneler
- JWT (Kimlik doğrulama)
- Axios (HTTP istekleri)
- Zod (Veri doğrulama)
- React Query (Veri yönetimi)

## Kurulum

### Gereksinimler
- Node.js (v14+)
- PostgreSQL (v13+)
- npm veya yarn

### Backend Kurulumu
```bash
# Repoyu klonla
git clone https://github.com/gctuzak/CRM_ITEM.git

# Backend dizinine git
cd CRM_ITEM/backend

# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env

# Veritabanını oluştur
npx prisma migrate dev

# Geliştirme sunucusunu başlat
npm run dev
```

### Frontend Kurulumu
```bash
# Frontend dizinine git
cd ../frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm start
```

## Proje Yapısı

### Backend Yapısı
```
backend/
├── src/
│   ├── controllers/    # İş mantığı
│   ├── middlewares/    # Ara yazılımlar
│   ├── routes/         # API rotaları
│   ├── services/       # Servis katmanı
│   ├── utils/          # Yardımcı fonksiyonlar
│   ├── app.ts         # Express uygulaması
│   └── index.ts       # Giriş noktası
├── prisma/
│   └── schema.prisma  # Veritabanı şeması
└── tests/            # Test dosyaları
```

### Frontend Yapısı
```
frontend/
├── src/
│   ├── components/    # React bileşenleri
│   ├── config/        # Yapılandırma
│   ├── hooks/         # Custom hooks
│   ├── services/      # API servisleri
│   ├── styles/        # CSS stilleri
│   ├── utils/         # Yardımcı fonksiyonlar
│   └── App.js        # Ana uygulama
└── public/           # Statik dosyalar
```

## API Endpoints

### Müşteri API'leri

#### Müşteri Arama
```http
GET /api/customers/search?query={searchTerm}
```
- Şirket ve kişilerde arama yapar
- En az 3 karakter gerektirir
- Case-insensitive arama yapar

#### Şirket Çalışanları
```http
GET /api/customers/company/{companyId}/persons
```
- Belirli bir şirkete ait çalışanları listeler
- Çalışanların temel bilgilerini döndürür

### Teklif API'leri

#### Teklif Oluşturma
```http
POST /api/quotes
```
- Yeni teklif oluşturur
- Müşteri, ürün ve fiyat bilgilerini içerir

#### Teklif Güncelleme
```http
PUT /api/quotes/{id}
```
- Mevcut teklifi günceller

## Frontend Bileşenleri

### QuoteForm Bileşeni
Teklif oluşturma ve düzenleme için kullanılan ana form bileşeni.

#### Özellikler
- Müşteri arama ve seçme
- İlgili kişi seçme
- Ürün/hizmet ekleme
- Fiyat hesaplama
- Dosya yükleme

#### Örnek Kullanım
```jsx
<QuoteForm 
  initialData={quoteData}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

### Müşteri Seçimi
- Hem şirket hem kişi araması yapılabilir
- Şirket seçildiğinde ilgili kişiler otomatik yüklenir
- Kişi seçildiğinde bağlı olduğu şirket otomatik seçilir

## Veritabanı Şeması

### Temel Tablolar

#### companies
- id (PK)
- name
- type
- tax_number (Unique)
- tax_office
- address
- phone
- email
- sector
- city

#### persons
- id (PK)
- first_name
- last_name
- identity_number (Unique)
- email
- phone
- address
- company_id (FK)
- type
- city

#### products
- id (PK)
- code (Unique)
- name
- description
- category_id (FK)
- type
- base_price
- currency
- tax_rate
- status

## Özellikler

### Müşteri Yönetimi
- Şirket ve kişi kaydı
- Detaylı müşteri profilleri
- İlişki yönetimi
- Arama ve filtreleme

### Teklif Yönetimi
- Hızlı teklif oluşturma
- Otomatik fiyat hesaplama
- Çoklu para birimi desteği
- PDF çıktı alma

### Ürün/Hizmet Yönetimi
- Kategorilendirme
- Özel alanlar
- Varyant yönetimi
- Stok takibi

## Güvenlik

### Kimlik Doğrulama
- JWT tabanlı kimlik doğrulama
- Rol tabanlı yetkilendirme
- Oturum yönetimi

### Veri Güvenliği
- Input validasyonu
- SQL injection koruması
- XSS koruması
- CORS yapılandırması

## Deployment

### Gereksinimler
- Node.js runtime
- PostgreSQL veritabanı
- PM2 veya benzeri process manager
- Nginx veya benzeri reverse proxy

### Deployment Adımları
1. Kodları production sunucusuna kopyala
2. Bağımlılıkları yükle
3. Environment değişkenlerini ayarla
4. Veritabanı migrasyonlarını çalıştır
5. Build al ve uygulamayı başlat
6. Reverse proxy yapılandırmasını yap

### Monitoring
- PM2 monitoring
- Error logging
- Performance tracking
- Health checks 