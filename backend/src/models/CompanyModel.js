const BaseModel = require('./BaseModel');
const { query } = require('../config/database');

class CompanyModel extends BaseModel {
    constructor() {
        super('companies');
    }

    async findByName(name) {
        try {
            const result = await query(
                'SELECT * FROM companies WHERE LOWER(name) LIKE LOWER($1)',
                [`%${name}%`]
            );
            return result;
        } catch (error) {
            throw new Error(`İsme göre arama yapılamadı: ${error.message}`);
        }
    }

    async findByTaxNumber(taxNumber) {
        try {
            const result = await query(
                'SELECT * FROM companies WHERE tax_number = $1',
                [taxNumber]
            );
            return result[0];
        } catch (error) {
            throw new Error(`Vergi numarasına göre arama yapılamadı: ${error.message}`);
        }
    }

    async findBySector(sector) {
        try {
            const result = await query(
                'SELECT * FROM companies WHERE sector = $1',
                [sector]
            );
            return result;
        } catch (error) {
            throw new Error(`Sektöre göre arama yapılamadı: ${error.message}`);
        }
    }

    async findByCity(city) {
        try {
            const result = await query(
                'SELECT * FROM companies WHERE city = $1',
                [city]
            );
            return result;
        } catch (error) {
            throw new Error(`Şehre göre arama yapılamadı: ${error.message}`);
        }
    }

    async findByRepresentative(representativeId) {
        try {
            const result = await query(
                'SELECT * FROM companies WHERE representative_id = $1',
                [representativeId]
            );
            return result;
        } catch (error) {
            throw new Error(`Temsilciye göre arama yapılamadı: ${error.message}`);
        }
    }

    async getEmployees(companyId) {
        try {
            const result = await query(
                `SELECT p.*, ce.position, ce.department
                FROM persons p
                JOIN company_employees ce ON p.id = ce.person_id
                WHERE ce.company_id = $1
                ORDER BY p.first_name, p.last_name`,
                [companyId]
            );
            return result;
        } catch (error) {
            throw new Error(`Çalışanlar getirilemedi: ${error.message}`);
        }
    }

    async getActiveEmployees(companyId) {
        try {
            const result = await query(
                `SELECT p.*, ce.position, ce.department
                FROM persons p
                JOIN company_employees ce ON p.id = ce.person_id
                WHERE ce.company_id = $1 AND ce.is_active = true
                ORDER BY p.first_name, p.last_name`,
                [companyId]
            );
            return result;
        } catch (error) {
            throw new Error(`Aktif çalışanlar getirilemedi: ${error.message}`);
        }
    }

    async getFiles(companyId) {
        try {
            const result = await query(
                `SELECT f.*, u.first_name as uploader_first_name, u.last_name as uploader_last_name
                FROM files f
                LEFT JOIN users u ON f.uploader_id = u.id
                WHERE f.entity_type = 'company' AND f.entity_id = $1
                ORDER BY f.created_at DESC`,
                [companyId]
            );
            return result;
        } catch (error) {
            throw new Error(`Dosyalar getirilemedi: ${error.message}`);
        }
    }

    async getCompanyDetails(companyId) {
        try {
            const result = await query(
                `SELECT c.*,
                    u1.first_name as representative_first_name,
                    u1.last_name as representative_last_name,
                    u2.first_name as creator_first_name,
                    u2.last_name as creator_last_name
                FROM companies c
                LEFT JOIN users u1 ON c.representative_id = u1.id
                LEFT JOIN users u2 ON c.created_by = u2.id
                WHERE c.id = $1`,
                [companyId]
            );
            return result[0];
        } catch (error) {
            throw new Error(`Şirket detayları getirilemedi: ${error.message}`);
        }
    }
}

module.exports = new CompanyModel(); 