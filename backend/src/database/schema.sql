-- Kullanıcılar tablosu
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Şirketler tablosu
CREATE TABLE Companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    tax_number VARCHAR(10) UNIQUE,
    email VARCHAR(255),
    phone VARCHAR(20),
    sector VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    address TEXT,
    creator_id INTEGER REFERENCES Users(id),
    representative_id INTEGER REFERENCES Users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kişiler tablosu
CREATE TABLE Persons (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    identity_number VARCHAR(11) UNIQUE,
    email VARCHAR(255),
    phone VARCHAR(20),
    city VARCHAR(100),
    district VARCHAR(100),
    address TEXT,
    creator_id INTEGER REFERENCES Users(id),
    representative_id INTEGER REFERENCES Users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Şirket Çalışanları tablosu
CREATE TABLE CompanyEmployees (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES Companies(id),
    person_id INTEGER REFERENCES Persons(id),
    position VARCHAR(100),
    department VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, person_id)
);

-- Dosyalar tablosu
CREATE TABLE Files (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    path VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    uploader_id INTEGER REFERENCES Users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger fonksiyonu: updated_at alanını güncelle
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ları oluştur
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON Users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON Companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_persons_updated_at
    BEFORE UPDATE ON Persons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_employees_updated_at
    BEFORE UPDATE ON CompanyEmployees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at
    BEFORE UPDATE ON Files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 