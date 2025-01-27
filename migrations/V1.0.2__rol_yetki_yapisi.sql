-- Roller tablosuna yetki seviyesi ekleme
ALTER TABLE roller ADD COLUMN yetki_seviyesi INTEGER;

-- Yetkiler tablosu
CREATE TABLE yetkiler (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    yetki_kodu VARCHAR(100) UNIQUE NOT NULL,
    yetki_adi VARCHAR(100) NOT NULL,
    aciklama TEXT,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    silindi BOOLEAN DEFAULT FALSE
);

-- Rol-Yetki ilişki tablosu
CREATE TABLE rol_yetkileri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rol_id UUID REFERENCES roller(id),
    yetki_id UUID REFERENCES yetkiler(id),
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    silindi BOOLEAN DEFAULT FALSE,
    UNIQUE(rol_id, yetki_id)
);

-- Kullanıcı-Rol ilişki tablosu
CREATE TABLE kullanici_roller (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kullanici_id UUID REFERENCES kullanicilar(id),
    rol_id UUID REFERENCES roller(id),
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    silindi BOOLEAN DEFAULT FALSE,
    UNIQUE(kullanici_id, rol_id)
);

-- Denetim kayıtları tablosu
CREATE TABLE denetim_kayitlari (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kullanici_id UUID REFERENCES kullanicilar(id),
    rol_id UUID REFERENCES roller(id),
    islem_turu VARCHAR(50),
    tablo_adi VARCHAR(100),
    kayit_id UUID,
    eski_degerler JSONB,
    yeni_degerler JSONB,
    ip_adresi VARCHAR(45),
    tarayici_bilgisi TEXT,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- İlgili tablolara oluşturan kullanıcı alanı ekleme
ALTER TABLE firmalar ADD COLUMN olusturan_kullanici_id UUID REFERENCES kullanicilar(id);
ALTER TABLE kisiler ADD COLUMN olusturan_kullanici_id UUID REFERENCES kullanicilar(id);
ALTER TABLE teklifler ADD COLUMN olusturan_kullanici_id UUID REFERENCES kullanicilar(id);
ALTER TABLE aktiviteler ADD COLUMN olusturan_kullanici_id UUID REFERENCES kullanicilar(id);

-- Ekip üyeleri tablosu
CREATE TABLE ekip_uyeleri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ekip_id UUID REFERENCES ekipler(id),
    kullanici_id UUID REFERENCES kullanicilar(id),
    rol_id UUID REFERENCES roller(id),
    yonetici_mi BOOLEAN DEFAULT FALSE,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    silindi BOOLEAN DEFAULT FALSE
);

-- Ekip hedefleri tablosu
CREATE TABLE ekip_hedefleri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ekip_id UUID REFERENCES ekipler(id),
    hedef_turu VARCHAR(50),
    hedef_degeri NUMERIC,
    donem VARCHAR(20),
    baslangic_tarihi DATE,
    bitis_tarihi DATE,
    gerceklesen NUMERIC,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    silindi BOOLEAN DEFAULT FALSE
);

-- Bildirimler tablosu
CREATE TABLE bildirimler (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kullanici_id UUID REFERENCES kullanicilar(id),
    rol_id UUID REFERENCES roller(id),
    bildirim_turu VARCHAR(50),
    baslik VARCHAR(200),
    icerik TEXT,
    okundu BOOLEAN DEFAULT FALSE,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    silindi BOOLEAN DEFAULT FALSE
);

-- Rapor yetkileri tablosu
CREATE TABLE rapor_yetkileri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rol_id UUID REFERENCES roller(id),
    rapor_kodu VARCHAR(100),
    goruntuleme BOOLEAN DEFAULT FALSE,
    excel_export BOOLEAN DEFAULT FALSE,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    silindi BOOLEAN DEFAULT FALSE
);

-- Temel yetkilerin eklenmesi
INSERT INTO yetkiler (yetki_kodu, yetki_adi, aciklama) VALUES
('view_own_entries', 'Kendi Kayıtlarını Görüntüleme', 'Sadece kendi girdiği bilgileri görür'),
('view_all_entries', 'Tüm Kayıtları Görüntüleme', 'Tüm kayıtları görüntüleyebilir'),
('view_reports', 'Raporları Görüntüleme', 'Raporları görüntüleyebilir'),
('export_excel', 'Excel Export', 'Raporu Excel''e aktarabilir'),
('view_phone_calls', 'Telefon Görüşmelerini Görüntüleme', 'Telefon görüşmelerini görebilir'),
('view_all_activities', 'Tüm Aktiviteleri Görüntüleme', 'Tüm aktivite türlerini görebilir'),
('manage_customers', 'Müşteri Yönetimi', 'Müşteri ekleyebilir/değiştirebilir'),
('view_customers', 'Müşteri Görüntüleme', 'Müşterileri görüntüleyebilir'),
('manage_activities', 'Aktivite Yönetimi', 'Aktivite & Görevleri girebilir'),
('edit_activities', 'Aktivite Düzenleme', 'Aktivite & Görevleri değiştirebilir'),
('manage_own_activities', 'Kendi Aktivitelerini Yönetme', 'Sadece kendi görevlerini yönetebilir'),
('view_offers', 'Teklif Görüntüleme', 'Teklifleri görüntüleyebilir'),
('manage_offers', 'Teklif Yönetimi', 'Teklifleri girebilir/değiştirebilir'),
('view_offer_status', 'Teklif Durumu Görüntüleme', 'Teklif durumunu görüntüleyebilir'),
('admin_access', 'Admin Erişimi', 'Tüm yetkilere sahip'),
('manage_users', 'Kullanıcı Yönetimi', 'Kullanıcı yönetimi'),
('view_all_reports', 'Tüm Raporları Görüntüleme', 'Tüm raporları görüntüleyebilir');

-- Temel rollerin eklenmesi
INSERT INTO roller (rol_adi, yetki_seviyesi, aciklama) VALUES
('Admin', 100, 'Tüm yetkilere sahip sistem yöneticisi'),
('Manager', 80, 'Yönetici rolü'),
('Sales Rep', 60, 'Satış temsilcisi'),
('Viewer', 40, 'İzleyici rolü'),
('Limited User', 20, 'Kısıtlı kullanıcı'); 