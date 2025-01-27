-- Admin rolüne tüm yetkileri atama
INSERT INTO rol_yetkileri (rol_id, yetki_id)
SELECT 
    (SELECT id FROM roller WHERE rol_adi = 'Admin'),
    id
FROM yetkiler;

-- Manager rolü yetkileri
INSERT INTO rol_yetkileri (rol_id, yetki_id)
SELECT 
    (SELECT id FROM roller WHERE rol_adi = 'Manager'),
    id
FROM yetkiler 
WHERE yetki_kodu IN (
    'view_all_entries',
    'view_reports',
    'export_excel',
    'view_phone_calls',
    'view_all_activities',
    'manage_customers',
    'manage_activities',
    'edit_activities',
    'manage_offers',
    'view_all_reports'
);

-- Sales Rep rolü yetkileri
INSERT INTO rol_yetkileri (rol_id, yetki_id)
SELECT 
    (SELECT id FROM roller WHERE rol_adi = 'Sales Rep'),
    id
FROM yetkiler 
WHERE yetki_kodu IN (
    'view_own_entries',
    'view_phone_calls',
    'manage_customers',
    'manage_own_activities',
    'view_offers',
    'manage_offers'
);

-- Viewer rolü yetkileri
INSERT INTO rol_yetkileri (rol_id, yetki_id)
SELECT 
    (SELECT id FROM roller WHERE rol_adi = 'Viewer'),
    id
FROM yetkiler 
WHERE yetki_kodu IN (
    'view_all_entries',
    'view_reports',
    'view_phone_calls',
    'view_customers',
    'view_offers',
    'view_offer_status'
);

-- Limited User rolü yetkileri
INSERT INTO rol_yetkileri (rol_id, yetki_id)
SELECT 
    (SELECT id FROM roller WHERE rol_adi = 'Limited User'),
    id
FROM yetkiler 
WHERE yetki_kodu IN (
    'view_own_entries',
    'manage_own_activities',
    'view_customers'
); 