Aşağıda, talep ettiğiniz web tabanlı CRM yazılımı için örnek bir PRD (Product Requirements Document) yer almaktadır. Bu doküman, yazılımın tüm temel gereksinimlerini, özelliklerini ve kullanım senaryolarını içermek üzere hazırlanmıştır. Gerektiğinde eklemeler ve çıkarmalar yapılabilir.

---

# 1. Giriş (Introduction)

Bu dokümanın amacı, **web tabanlı CRM** (Customer Relationship Management) yazılımına ait gereksinimleri ve işlevselliği tanımlamaktır. Yazılım, çoklu kullanıcı desteği ile müşteri, teklif, görev ve aktivite yönetimini tek bir platform üzerinden kolay ve verimli bir şekilde gerçekleştirebilmeyi hedeflemektedir. Dokümanda, yazılımın temel fonksiyonları, teknik gereksinimleri, kullanıcı rolleri ve yapılması beklenen operasyonların ayrıntıları yer almaktadır.

---

# 2. Amaç ve Hedefler (Goals & Objectives)

1. **Müşteri Yönetimi**: Müşteriler ile ilgili tüm bilgilerin (iletişim, şirket bilgisi vb.) merkezi bir veritabanında saklanması ve yönetimi.  
2. **Teklif Yönetimi**: Ürün veya hizmet bazlı tekliflerin oluşturulması, değiştirilmesi, sürümlendirilmesi ve PDF olarak kaydedilebilmesi.  
3. **Görev ve Aktivite Yönetimi**: Kullanıcıların kendilerine veya diğer kullanıcılara görevler oluşturabilmesi, atayabilmesi, takip edebilmesi ve hatırlatmalar alabilmesi.  
4. **Doküman Yönetimi**: Teklifler ve müşteriler için resim, PDF, Autocad projeleri gibi dosyaların eklenmesi ve saklanması.  
5. **Çoklu Kullanıcı Desteği**: Farklı yetkilere sahip kullanıcıların aynı platform üzerinden ortak veri tabanı kullanarak çalışma imkanı.  
6. **AI Desteği**: Cursor IDE üzerindeki yapay zeka desteğiyle yazılımın geliştirme sürecini hızlandırmak, kod kalitesini artırmak.

---

# 3. Kapsam (Scope)

Bu PRD, aşağıdaki ana modülleri kapsar:

1. **Kullanıcı Yönetimi**:  
   - Kullanıcı giriş/çıkış (authentication)  
   - Roller ve yetkilendirmeler (authorization)

2. **Müşteri Yönetimi**:  
   - Müşteri kaydı, güncelleme, silme  
   - Müşteri detay sayfası (iletişim bilgileri, şirket bilgileri, geçmiş aktiviteler vb.)

3. **Ürün/Servis Yönetimi**:  
   - Ürün veya servis bilgileri (isim, fiyat, açıklama vb.)  
   - Müşteri bazlı ürün seçimi  
   - Teklifte kullanılmak üzere ürünlerin veritabanından çekilmesi

4. **Teklif Yönetimi**:  
   - Teklif oluşturma (tekil veya çoklu ürün/servis seçimi)  
   - Teklifin PDF olarak indirilmesi, e-posta ile paylaşımı  
   - Teklif versiyonlama (önceki sürümlerin saklanması)  
   - Tekliflere ait doküman ekleme (PDF, resim, Autocad dosyaları vb.)

5. **Görev ve Aktivite Yönetimi**:  
   - Aktivite/iş listesi oluşturma (ör. “müşteri ziyareti”, “teknik destek talebi” vb.)  
   - Görev atama (kullanıcı bazlı)  
   - Takip (tamamlanma durumu, hatırlatmalar, tarihçeler)  
   - Hatırlatıcılar (planlanmış aktiviteler için bildirim)

6. **Dosya/Doküman Yönetimi**:  
   - Müşteri ve teklif düzeyinde doküman ekleyebilme, indirebilme  
   - Dokümanların ilgili kayıtlarla ilişkilendirilmesi

7. **Loglama ve Raporlama (Opsiyonel / İsteğe Bağlı Ek Özellik)**:  
   - Sistem loglarının tutulması  
   - Aktivite raporları (ör. günlük/haftalık görevler)  
   - Teklif istatistikleri, müşteri analizleri

8. **Bildirim Yönetimi (Opsiyonel / İsteğe Bağlı Ek Özellik)**:  
   - E-posta veya uygulama içi bildirim  
   - Görev hatırlatıcısı

---

# 4. Kullanıcı Rolleri (User Roles)

1. **Admin**  
   - Tüm kullanıcıları ve rolleri yönetir (ekleme, silme, güncelleme)  
   - Veritabanındaki tüm kayıtlara erişebilir, sistem ayarlarını yapar

2. **Satış Temsilcisi**  
   - Müşteri bilgilerini görüntüleme, ekleme, güncelleme  
   - Teklif oluşturma, düzenleme, gönderme  
   - Görev ve aktiviteleri yönetme (kendisi veya ekibi için)

3. **Operasyon/Gerçekleştirme Sorumlusu** (Opsiyonel)  
   - Teklifin kabulünden sonra operasyonel detayları yönetme  
   - Müşteri ile ilgili dokümanları inceleme, güncelleme

4. **İzleyici (Viewer)**  
   - Salt okunur yetkiler (teklif ve müşteri kayıtlarını görüntüleme)  
   - Değişiklik yapamaz

---

# 5. Teknik Mimarî ve Geliştirme Araçları (Technical Architecture & Tools)

- **Frontend**:  
  - React veya Vue.js (ücretsiz ve açık kaynak)  
  - HTML5, CSS3, JavaScript/TypeScript  
  - Kullanıcı arayüzü tasarımı için gerekli kütüphaneler (ör. Bootstrap, TailwindCSS)

- **Backend**:  
  - Node.js + Express.js (ücretsiz ve açık kaynak)  
  - RESTful API mimarisi (JSON formatında veri alışverişi)

- **Veritabanı**:  
  - PostgreSQL veya MySQL (her ikisi de ücretsiz topluluk sürümleri mevcut)  
  - ORM için Sequelize veya TypeORM (isteğe bağlı)  

- **PDF Oluşturma**:  
  - jsPDF veya PDFMake gibi ücretsiz kütüphaneler

- **Dosya Depolama**:  
  - Dosyalar sunucu üzerinde veya bulut üzerinde (AWS S3’nin ücretsiz katmanı veya Google Cloud Storage; proje kapsamına göre değiştirilebilir)  
  - Gerekirse sadece sunucu diskinde saklama (küçük veya orta ölçekli projeler için uygundur)

- **Geliştirme Ortamı**:  
  - Cursor IDE ile yapay zeka desteği  
  - Git sürüm kontrol sistemi (GitHub, GitLab vb. ile entegre)

- **Barındırma (Deployment)**:  
  - Heroku’nun ücretsiz katmanı veya Vercel/Netlify (frontend için)  
  - PostgreSQL/MySQL veritabanı için de benzer ücretsiz katman veya kendi sunucunuz

---

# 6. Fonksiyonel Gereksinimler (Functional Requirements)

### 6.1. Kullanıcı Yönetimi
1. **Kullanıcı girişi (Login):**  
   - E-posta/şifre veya kullanıcı adı/şifre ile giriş  
   - Yanlış giriş denemesi belirli sayıyı aşarsa hesap kilitleme veya geçici bloklama

2. **Kullanıcı yetkilendirme (Authorization):**  
   - Rol bazlı görünüm ve eylem kısıtlamaları  
   - Admin, satış temsilcisi, izleyici vb.

3. **Şifre sıfırlama:**  
   - E-posta yoluyla geçici şifre oluşturma linki

### 6.2. Müşteri Yönetimi
1. **Müşteri ekleme/güncelleme/silme:**  
   - Müşteri ismi, adresi, iletişim bilgileri, şirket bilgileri vb. alanları içermeli  
   - Müşteri bilgilerinin tarihçesi (kim ekledi, ne zaman güncellendi)

2. **Müşteri detay sayfası:**  
   - İlgili tüm aktiviteleri, teklifleri, dokümanları ve notları görüntüleyebilme  
   - Müşteriyle ilgili planlanmış görevlerin listesi

### 6.3. Ürün/Servis Yönetimi
1. **Ürün kataloğu:**  
   - Ürün adı, açıklaması, fiyatı, stok bilgisi (isteğe bağlı)  
   - Mevcut ürünleri listeleme, ekleme, düzenleme, silme  
2. **Ürün seçerek teklif oluşturma:**  
   - Bir veya birden fazla ürünü teklif kalemi olarak seçebilme

### 6.4. Teklif Yönetimi
1. **Teklif oluşturma:**  
   - Müşteri seçimi, ürün seçimi, adet/fiyat bilgisi, ödeme koşulları vb.  
   - Teklif notları, özel istekler vb. alanlar

2. **Teklif sürümleme:**  
   - Teklif üzerinde yapılan her değişiklik için yeni bir sürüm oluşturma  
   - Önceki sürümlere geri dönebilme veya görüntüleyebilme

3. **PDF oluşturma ve indirme:**  
   - Teklif detaylarını PDF formatına dönüştürerek sunabilme  
   - Uygulama içinden PDF’i indirip paylaşabilme

4. **Teklife dosya ekleme:**  
   - Teklifle ilişkili resim, PDF, Autocad proje dosyaları vb. ekleyebilme  
   - Eklenen dosyaları listeleyebilme ve indirebilme

### 6.5. Görev ve Aktivite Yönetimi
1. **Görev/aktivite oluşturma:**  
   - Görev başlığı, açıklaması, başlangıç ve bitiş tarihi, öncelik vb.  
   - Görevin ilgili olduğu müşteri seçilebilmeli

2. **Görev atama ve takibi:**  
   - Görev bir kullanıcıya atanmalı (veya ekip bazlı olabilir)  
   - Görev durumları: “Yeni”, “Devam Ediyor”, “Tamamlandı”, “İptal”

3. **Hatırlatıcılar:**  
   - Görev veya aktivite yaklaşmadan önce bildirim  
   - E-posta ya da uygulama içi uyarı

4. **Aktivite geçmişi (audit trail):**  
   - Görev durumu ve sahibi değişikliklerinin kaydı  
   - Zaman damgası (timestamp)

### 6.6. Doküman Yönetimi
1. **Doküman ekleme/silme:**  
   - Müşteri veya teklif kaydına eklenebilir  
   - İlgili kayda referans ile saklanır

2. **Doküman görüntüleme/indirme:**  
   - Desteklenen formatlar: PDF, resim (PNG/JPEG), Autocad (DWG veya DXF) vb.  
   - İndirme linki veya inline görüntüleme (PDF vb. formatlar için)

### 6.7. Loglama ve Raporlama (İsteğe Bağlı Genişletme)
1. **Sistem loglama:**  
   - Kullanıcı işlemlerinin, giriş ve çıkışların loglanması  
   - Admin paneli üzerinden log görüntüleme

2. **Raporlama:**  
   - Teklif raporları (kabul/ret sayıları)  
   - Müşteri bazlı genel durum raporları  
   - Görev tamamlama istatistikleri

### 6.8. Bildirim Yönetimi (Opsiyonel)
1. **E-posta bildirimleri:**  
   - Yeni bir görev atandığında, teklif oluşturulduğunda veya revize edildiğinde  
2. **Anlık bildirim (push notification) veya uygulama içi mesajlar** (kullanıcı arayüzünde beliren bildirimler)

---

# 7. Kullanım Senaryoları (User Flows)

1. **Müşteri Ekleme**  
   - **Adım 1**: Kullanıcı “Yeni Müşteri” butonuna tıklar.  
   - **Adım 2**: Müşteri bilgileri (isim, adres, iletişim) doldurulur.  
   - **Adım 3**: “Kaydet” butonuna basarak veritabanına kayıt yapılır.  
   - **Adım 4**: Başarılı mesajı veya hata mesajı görüntülenir.

2. **Teklif Oluşturma ve Versiyonlama**  
   - **Adım 1**: Kullanıcı “Yeni Teklif” butonuna tıklar.  
   - **Adım 2**: Müşteri seçilir, teklif için ürünler ve adet/fiyat bilgisi girilir.  
   - **Adım 3**: Teklifi kaydeder ve PDF çıktısını indirir veya e-posta ile gönderir.  
   - **Adım 4**: Teklifte değişiklik yapılmak istenirse “Düzenle” butonuna basılır.  
   - **Adım 5**: Sistem eski teklifin bir kopyasını oluşturur (versiyonlama).  
   - **Adım 6**: Yeni versiyon kaydedilir, önceki sürüm veritabanında saklanır.

3. **Görev Oluşturma, Atama ve Takip**  
   - **Adım 1**: Kullanıcı “Yeni Görev” ekranını açar.  
   - **Adım 2**: Görev başlığı, açıklaması, tarihleri ve atanacak kullanıcı bilgileri girilir.  
   - **Adım 3**: Görev yaratılır; atanan kullanıcıya bildirim/e-posta gider.  
   - **Adım 4**: Görev tamamlandığında statü “Tamamlandı” olarak güncellenir.

4. **Doküman Ekleme**  
   - **Adım 1**: Müşteri veya teklif detay sayfasına girilir.  
   - **Adım 2**: “Doküman Ekle” butonuna tıklanır.  
   - **Adım 3**: Bilgisayardan dosya seçilir ve eklenir.  
   - **Adım 4**: Dosya, sunucuda saklanır ve ilgili kayıtla ilişkilendirilir.

---

# 8. Performans ve Güvenlik Gereksinimleri (Non-Functional Requirements)

1. **Performans**  
   - Maksimum 2-3 saniyelik yanıt süresi hedefi (ortalama yükte)  
   - Veritabanı sorguları optimize edilmiş olmalı (indexleme, cache mekanizmaları)

2. **Güvenlik**  
   - Şifreli bağlantı (HTTPS)  
   - Parolaların salted hash ile saklanması (ör. bcrypt)  
   - SQL Injection ve XSS gibi saldırılara karşı koruma

3. **Veri Yedekleme ve Geri Yükleme**  
   - Günlük/haftalık veritabanı yedeği  
   - Dosya yedekleme stratejisi (belirli aralıklarla bulut veya farklı bir depolama alanına)

4. **Kullanılabilirlik**  
   - Kolay ve sezgisel kullanıcı arayüzü  
   - Hata mesajlarının açıklayıcı olması

5. **Sürüm Kontrolü ve Sürekli Entegrasyon**  
   - Geliştirme aşamasında Git kullanımı  
   - Mümkünse otomatik test ve build süreçleri (CI/CD)

---

# 9. Veri Modeli Taslağı (Data Model Draft)

Aşağıdaki tablo, örnek bir veri modeli yapısı göstermektedir. Gerçek uygulamada ek alanlar veya ilişkiler gerekebilir.

1. **Users**  
   - `id` (PK)  
   - `name`  
   - `email`  
   - `password_hash`  
   - `role` (admin, sales, viewer vb.)  
   - `created_at`, `updated_at`

2. **Customers**  
   - `id` (PK)  
   - `name` (Şirket veya kişi ismi)  
   - `contact_person`  
   - `phone`  
   - `email`  
   - `address`  
   - `created_by` (FK -> Users)  
   - `created_at`, `updated_at`

3. **Products**  
   - `id` (PK)  
   - `name`  
   - `description`  
   - `price`  
   - `created_at`, `updated_at`

4. **Quotations (Teklifler)**  
   - `id` (PK)  
   - `customer_id` (FK -> Customers)  
   - `status` (draft, sent, approved, rejected vb.)  
   - `version` (Teklif versiyonu)  
   - `created_by` (FK -> Users)  
   - `created_at`, `updated_at`

5. **Quotation_Items (Teklif Kalemleri)**  
   - `id` (PK)  
   - `quotation_id` (FK -> Quotations)  
   - `product_id` (FK -> Products)  
   - `quantity`  
   - `price`  
   - `created_at`, `updated_at`

6. **Tasks (Görevler)**  
   - `id` (PK)  
   - `title`  
   - `description`  
   - `assigned_to` (FK -> Users)  
   - `customer_id` (FK -> Customers) (Opsiyonel)  
   - `due_date`  
   - `status` (new, in_progress, completed, canceled)  
   - `created_by` (FK -> Users)  
   - `created_at`, `updated_at`

7. **Documents (Ek Dosyalar)**  
   - `id` (PK)  
   - `filename`  
   - `file_path`  
   - `file_type` (pdf, image, dwg vb.)  
   - `customer_id` (FK -> Customers, opsiyonel)  
   - `quotation_id` (FK -> Quotations, opsiyonel)  
   - `uploaded_by` (FK -> Users)  
   - `created_at`, `updated_at`

8. **Logs (Opsiyonel)**  
   - `id` (PK)  
   - `action_type` (login, create, update, delete vb.)  
   - `description`  
   - `user_id` (FK -> Users)  
   - `created_at`

---

# 10. Zaman Planı ve Teslimat (Timeline & Deliverables)

1. **Araştırma ve Planlama (1-2 Hafta)**  
   - İhtiyaç analizi, teknik mimari tasarımı, veritabanı şemasının oluşturulması  
   - AI desteğiyle (Cursor IDE) proje yapılandırması

2. **MVP (Minimum Viable Product) Geliştirme (4-6 Hafta)**  
   - Kullanıcı yönetimi, müşteri yönetimi, teklif yönetiminin temel fonksiyonları  
   - Veritabanı bağlantıları, temel CRUD işlemleri

3. **Görev Yönetimi ve Doküman Ekleme (2-3 Hafta)**  
   - Görev atama, takip ve hatırlatıcı modüllerinin eklenmesi  
   - Doküman yükleme ve saklama işlevi

4. **Versiyonlama, Raporlama, Loglama (2-3 Hafta)**  
   - Teklif versiyonlama, sistem loglama  
   - Basit raporlama ekranları

5. **Test ve Hata Düzeltme (2-3 Hafta)**  
   - Birim testler, entegrasyon testleri, kullanıcı kabul testleri  
   - Güvenlik ve performans testleri

6. **Canlıya Alma ve Son Kontroller (1-2 Hafta)**  
   - Sunucu ve veritabanı konfigürasyonları  
   - Kullanıcı eğitimleri, dokümantasyon

> **Not**: Bu süreler ekibin büyüklüğüne, projenin karmaşıklığına ve yapılacak ek entegrasyonlara göre değişebilir.

---

# 11. Riskler ve Alınacak Önlemler (Risks & Mitigations)

1. **Performans Sorunları**  
   - Erken aşamada veritabanı ve API optimizasyonu  
   - Ölçeklenebilir mimari ve caching mekanizmaları

2. **Güvenlik Açıkları**  
   - Düzenli güvenlik testleri (penetrasyon testleri)  
   - Kullanıcı girişi ve veri girişlerinde validasyon

3. **Veri Kaybı**  
   - Düzenli yedekleme planı  
   - Disaster recovery senaryoları

4. **Kullanıcı Direnci**  
   - Kullanıcı dostu arayüz, kolay kullanım  
   - Eğitim ve rehber dokümantasyon sağlanması

5. **Zaman Planına Uyumsuzluk**  
   - Etap bazlı (Sprint) çalışma ve ara değerlendirmeler  
   - Proje yönetim aracı (Jira, Trello, Asana vb.) kullanımı

---

# 12. Ek Özellik Önerileri (Nice-to-Have)

- **API Entegrasyonları**:  
  - E-posta servisleri veya SMS bildirim servisleriyle otomasyon  
- **Otomatik Faturalandırma**:  
  - Teklif onaylandıktan sonra otomatik faturalandırma modülü  
- **Mobil Uygulama**:  
  - Saha ekibi için iOS/Android uygulaması  
- **ChatGPT veya Benzeri AI Entegrasyonu**:  
  - Müşteri etkileşimleri veya hızlı e-posta yanıtları için entegrasyon

---

## Sonuç

Bu PRD belgesi, web tabanlı CRM yazılımının ana hatlarını, teknik gereksinimlerini ve modüllerini detaylı şekilde tanımlamaktadır. Proje, **müşteri yönetimi**, **teklif yönetimi**, **görev/aktivite yönetimi** ve **doküman yönetimi** fonksiyonlarını kapsayan, çoklu kullanıcı desteği sağlayan ve açık kaynak/free araçlar kullanılarak geliştirilebilir bir yapıdadır.

Ek olarak kullanıcı deneyiminin iyileştirilmesi, güvenlik, performans, sürüm kontrolü ve otomasyon testleri gibi alanlar da göz ardı edilmemelidir. Proje, planlı bir şekilde yönetildiğinde, küçük ve orta ölçekli firmalar için iş süreçlerini dijitalleştiren, verimliliği ve müşteri memnuniyetini artıran bir CRM platformu sunacaktır.

---

CRM_ITEM/
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── .env
│   └── package.json
│
└── backend/
    ├── src/
    │   └── server.js
    ├── config/
    │   └── database.js
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middlewares/
    ├── utils/
    ├── .env
    └── package.json