-- Kullanıcı Rolleri
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');

-- Kullanıcılar Tablosu
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Şirket Türleri
CREATE TYPE company_type AS ENUM ('anonim', 'limited', 'sahis', 'diger');

-- Şirketler Tablosu
CREATE TABLE IF NOT EXISTS Companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type company_type NOT NULL,
    tax_office VARCHAR(100),
    tax_number VARCHAR(10),
    email VARCHAR(100),
    phone VARCHAR(20),
    website VARCHAR(100),
    sector VARCHAR(50),
    address TEXT,
    city VARCHAR(50),
    district VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'Türkiye',
    customer_representative INTEGER REFERENCES Users(id),
    created_by INTEGER REFERENCES Users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Kişi Türleri
CREATE TYPE person_type AS ENUM ('individual', 'employee', 'freelancer');

-- Kişiler Tablosu
CREATE TABLE IF NOT EXISTS Persons (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    type person_type NOT NULL,
    title VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    identity_number VARCHAR(11),
    address TEXT,
    city VARCHAR(50),
    district VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'Türkiye',
    customer_representative INTEGER REFERENCES Users(id),
    created_by INTEGER REFERENCES Users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Şirket Çalışanları Tablosu
CREATE TABLE IF NOT EXISTS CompanyEmployees (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES Companies(id) ON DELETE CASCADE,
    person_id INTEGER REFERENCES Persons(id) ON DELETE CASCADE,
    position VARCHAR(50),
    department VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, person_id)
);

-- Dosya Türleri
CREATE TYPE file_type AS ENUM ('image', 'document', 'other');

-- Dosyalar Tablosu
CREATE TABLE IF NOT EXISTS Files (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    path VARCHAR(255) NOT NULL,
    type file_type NOT NULL DEFAULT 'other',
    entity_type VARCHAR(50) NOT NULL, -- 'company' veya 'person'
    entity_id INTEGER NOT NULL,
    uploaded_by INTEGER REFERENCES Users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX idx_companies_name ON Companies(name);
CREATE INDEX idx_companies_tax_number ON Companies(tax_number);
CREATE INDEX idx_persons_email ON Persons(email);
CREATE INDEX idx_persons_identity_number ON Persons(identity_number);
CREATE INDEX idx_company_employees_company ON CompanyEmployees(company_id);
CREATE INDEX idx_company_employees_person ON CompanyEmployees(person_id);
CREATE INDEX idx_files_entity ON Files(entity_type, entity_id);

-- Trigger fonksiyonu - updated_at güncellemesi için
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