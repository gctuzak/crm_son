# Rol ve Yetki Yapısı

## Roller

1. **Admin**
   - Tüm yetkilere sahip
   - Yönetici hariç seçeneği işaretli olanlar dahil tüm işlemleri yapabilir

2. **Manager**
   - Tüm kayıtları görüntüleyebilir
   - Raporları görüntüleyebilir ve Excel'e aktarabilir
   - Telefon görüşmelerini görebilir
   - Tüm aktivite türlerini görebilir
   - Müşteri ekleyebilir/değiştirebilir
   - Aktivite ve görevleri girebilir/değiştirebilir
   - Teklifleri yönetebilir
   - Tüm raporları görüntüleyebilir

3. **Sales Rep (Satış Temsilcisi)**
   - Kendi girdiği bilgileri görür
   - Telefon görüşmelerini görebilir
   - Müşteri ekleyebilir/değiştirebilir
   - Kendi aktivitelerini yönetebilir
   - Teklifleri görüntüleyebilir ve yönetebilir

4. **Viewer (İzleyici)**
   - Tüm kayıtları görüntüleyebilir
   - Raporları görüntüleyebilir
   - Telefon görüşmelerini görebilir
   - Müşterileri görüntüleyebilir
   - Teklifleri ve durumlarını görüntüleyebilir

5. **Limited User (Kısıtlı Kullanıcı)**
   - Sadece kendi girdiği bilgileri görür
   - Kendi aktivitelerini yönetebilir
   - Müşterileri görüntüleyebilir

## Yetkiler

### Görüntüleme Yetkileri
- `view_own_entries`: Sadece kendi girdiği bilgileri görür
- `view_all_entries`: Tüm kayıtları görüntüleyebilir
- `view_reports`: Raporları görüntüleyebilir
- `export_excel`: Raporu Excel'e aktarabilir
- `view_phone_calls`: Telefon görüşmelerini görebilir
- `view_all_activities`: Tüm aktivite türlerini görebilir

### Müşteri İşlemleri
- `manage_customers`: İlişki & Müşteri ekleyebilir/değiştirebilir
- `view_customers`: Müşterileri görüntüleyebilir

### Aktivite İşlemleri
- `manage_activities`: Aktivite & Görevleri girebilir
- `edit_activities`: Aktivite & Görevleri değiştirebilir
- `manage_own_activities`: Sadece kendi görevlerini yönetebilir

### Teklif İşlemleri
- `view_offers`: Teklifleri görüntüleyebilir
- `manage_offers`: Teklifleri girebilir/değiştirebilir
- `view_offer_status`: Teklif durumunu görüntüleyebilir

### Sistem Yönetimi
- `admin_access`: Tüm yetkilere sahip
- `manage_users`: Kullanıcı yönetimi
- `view_all_reports`: Tüm raporları görüntüleyebilir

## Veritabanı Yapısı

### users
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### roles
```sql
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### user_roles
```sql
CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(user_id),
    role_id INTEGER REFERENCES roles(role_id),
    PRIMARY KEY (user_id, role_id)
);
```

### permissions
```sql
CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### role_permissions
```sql
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(role_id),
    permission_id INTEGER REFERENCES permissions(permission_id),
    PRIMARY KEY (role_id, permission_id)
);
``` 