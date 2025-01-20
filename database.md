# CRM Veritabanı Yapısı

## Temel Tablolar

### Users (Kullanıcılar)
```sql
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Roles (Roller)
```sql
CREATE TABLE Roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE UserRoles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE CASCADE
);
```

## Müşteri Yönetimi

### Companies (Şirketler)
```sql
CREATE TABLE Companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type ENUM('anonim', 'limited', 'sahis', 'diger'),
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    sector ENUM('technology', 'manufacturing', 'retail', 'service', 'other'),
    tax_office VARCHAR(255),
    tax_number VARCHAR(50),
    customer_representative VARCHAR(255),
    address TEXT,
    city VARCHAR(50),
    district VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'Türkiye',
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(id)
);

CREATE INDEX idx_companies_name ON Companies(name);
CREATE INDEX idx_companies_tax ON Companies(tax_number);
```

### Persons (Kişiler)
```sql
CREATE TABLE Persons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100),
    title VARCHAR(50),
    customer_category ENUM('individual', 'employee', 'freelancer'),
    email VARCHAR(255),
    phone VARCHAR(20),
    identity_number CHAR(11),
    address TEXT,
    city VARCHAR(50),
    district VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'Türkiye',
    customer_representative VARCHAR(255),
    email_subscription ENUM('active', 'cancelled') DEFAULT 'active',
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(id)
);

CREATE INDEX idx_persons_name ON Persons(name, surname);
CREATE INDEX idx_persons_identity ON Persons(identity_number);
CREATE INDEX idx_persons_email ON Persons(email);
```

### CompanyEmployees (Şirket Çalışanları)
```sql
CREATE TABLE CompanyEmployees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    person_id INT NOT NULL,
    company_id INT NOT NULL,
    position VARCHAR(100),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES Persons(id),
    FOREIGN KEY (company_id) REFERENCES Companies(id),
    FOREIGN KEY (created_by) REFERENCES Users(id)
);

CREATE INDEX idx_company_employees ON CompanyEmployees(company_id, person_id);
```

### Files (Dosyalar)
```sql
CREATE TABLE Files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    entity_type ENUM('company', 'person') NOT NULL,
    entity_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INT,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES Users(id),
    FOREIGN KEY (entity_id) REFERENCES Companies(id) ON DELETE CASCADE,
    FOREIGN KEY (entity_id) REFERENCES Persons(id) ON DELETE CASCADE
);

CREATE INDEX idx_files_entity ON Files(entity_type, entity_id);
```

## Aktivite Takibi

### ActivityLogs (Aktivite Logları)
```sql
CREATE TABLE ActivityLogs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    entity_type ENUM('company', 'person', 'file') NOT NULL,
    entity_id INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE INDEX idx_activity_logs ON ActivityLogs(entity_type, entity_id);
```

## Veritabanı Kuralları

1. **Veri Bütünlüğü:**
   - Her tabloda `created_at` ve `updated_at` alanları bulunur
   - Her kayıt işleminde `created_by` veya `uploaded_by` gibi kullanıcı referansı tutulur
   - Foreign key'ler ile referans bütünlüğü sağlanır
   - Kritik alanlarda ENUM kullanılarak veri tutarlılığı korunur

2. **İndeksleme:**
   - Sık sorgulanan alanlarda indeks kullanılır
   - Birleşik sorgular için çoklu indeksler oluşturulur
   - Foreign key'ler otomatik olarak indekslenir

3. **Güvenlik:**
   - Kullanıcı şifreleri hash'lenerek saklanır
   - Rol tabanlı yetkilendirme sistemi kullanılır
   - Hassas veriler için ek güvenlik önlemleri alınır

4. **İlişkiler:**
   - Şirket-Çalışan: Çoktan-çoğa ilişki (CompanyEmployees üzerinden)
   - Dosya-Varlık: Çoktan-bire ilişki (polymorphic)
   - Kullanıcı-Rol: Çoktan-çoğa ilişki (UserRoles üzerinden)

## Frontend Form Kuralları

1. **Şirket Formu:**
   - Zorunlu alanlar: name
   - Seçimli alanlar: type, sector
   - Otomatik alanlar: created_at, updated_at, created_by

2. **Kişi Formu:**
   - Zorunlu alanlar: name
   - TC Kimlik No kontrolü: 11 haneli
   - Şirket seçimi: Aktif şirketler listesinden

3. **Dosya Yükleme:**
   - Desteklenen formatlar: .pdf, .jpg, .jpeg, .png, .dwg, .dxf, .doc, .docx, .xls, .xlsx
   - Maksimum dosya boyutu: 10MB
   - Otomatik thumbnail oluşturma (resimler için)

## Genişletme Planı

1. **Yakın Dönem:**
   - İl-İlçe referans tabloları
   - Dosya kategorileri
   - Etiketleme sistemi

2. **Orta Dönem:**
   - Şirket şubeleri
   - İletişim geçmişi
   - Görev takibi

3. **Uzun Dönem:**
   - Proje yönetimi
   - Fatura sistemi
   - Raporlama modülü