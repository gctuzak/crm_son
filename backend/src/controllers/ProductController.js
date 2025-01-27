const db = require('../database');

class ProductController {
    // Kategorileri getir
    static async getCategories(req, res) {
        try {
            const result = await db.query('SELECT * FROM product_categories ORDER BY name');
            res.json(result.rows);
        } catch (error) {
            console.error('Kategoriler getirilirken hata:', error);
            res.status(500).json({ error: 'Kategoriler getirilirken bir hata oluştu' });
        }
    }

    // Birimleri getir
    static async getUnits(req, res) {
        try {
            const result = await db.query('SELECT * FROM units ORDER BY name');
            res.json(result.rows);
        } catch (error) {
            console.error('Birimler getirilirken hata:', error);
            res.status(500).json({ error: 'Birimler getirilirken bir hata oluştu' });
        }
    }

    // Tüm ürünleri getir
    static async getAll(req, res) {
        try {
            const { search } = req.query;
            let query = `
                SELECT p.*, 
                       pc.name as category_name,
                       u.name as unit_name
                FROM products p
                LEFT JOIN product_categories pc ON p.category_id = pc.id
                LEFT JOIN units u ON p.unit_id = u.id
            `;

            const params = [];
            if (search) {
                query += `
                    WHERE p.name ILIKE $1 
                    OR p.code ILIKE $1
                    OR p.description ILIKE $1
                `;
                params.push(`%${search}%`);
            }

            query += ' ORDER BY p.created_at DESC';

            const result = await db.query(query, params);
            res.json(result.rows);
        } catch (error) {
            console.error('Ürünler getirilirken hata:', error);
            res.status(500).json({ error: 'Ürünler getirilirken bir hata oluştu' });
        }
    }

    // ID'ye göre ürün getir
    static async getById(req, res) {
        try {
            const { id } = req.params;
            
            // Ana ürün bilgilerini getir
            const productResult = await db.query(`
                SELECT p.*, 
                       pc.name as category_name,
                       u.name as unit_name
                FROM products p
                LEFT JOIN product_categories pc ON p.category_id = pc.id
                LEFT JOIN units u ON p.unit_id = u.id
                WHERE p.id = $1
            `, [id]);

            if (productResult.rows.length === 0) {
                return res.status(404).json({ error: 'Ürün bulunamadı' });
            }

            const product = productResult.rows[0];

            // Özel alanları getir
            const customFieldsResult = await db.query(`
                SELECT 
                    id,
                    name,
                    field_type,
                    CASE 
                        WHEN is_required IS NULL THEN false 
                        ELSE is_required 
                    END as is_required,
                    options
                FROM product_custom_fields 
                WHERE product_id = $1
                ORDER BY id
            `, [id]);

            // Varyantları getir
            const variantsResult = await db.query(`
                SELECT 
                    id,
                    name,
                    options,
                    COALESCE(price_adjustment, 0) as price_adjustment
                FROM product_variants 
                WHERE product_id = $1
                ORDER BY id
            `, [id]);

            // Görselleri getir
            const imagesResult = await db.query(
                'SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order',
                [id]
            );

            // Tüm bilgileri birleştir
            product.customFields = customFieldsResult.rows.map(field => ({
                ...field,
                is_required: field.is_required || false,
                options: field.options || null
            }));
            
            product.variants = variantsResult.rows.map(variant => ({
                ...variant,
                options: variant.options || null,
                price_adjustment: parseFloat(variant.price_adjustment) || 0
            }));
            
            product.images = imagesResult.rows;

            res.json(product);
        } catch (error) {
            console.error('Ürün getirilirken hata:', error);
            res.status(500).json({ error: 'Ürün getirilirken bir hata oluştu' });
        }
    }

    // Yeni ürün oluştur
    static async create(req, res) {
        try {
            const {
                code,
                name,
                description,
                category_id,
                type,
                unit_id,
                base_price,
                currency,
                status,
                tax_rate,
                min_quantity,
                max_quantity,
                stock_tracking,
                stock_quantity,
                customFields,
                variants
            } = req.body;

            // Ana ürün bilgilerini ekle
            const productResult = await db.query(`
                INSERT INTO products (
                    code, name, description, category_id, type, unit_id,
                    base_price, currency, status, tax_rate, min_quantity,
                    max_quantity, stock_tracking, stock_quantity, created_by
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                RETURNING id
            `, [
                code, name, description, category_id, type, unit_id,
                base_price, currency, status, tax_rate, min_quantity,
                max_quantity, stock_tracking, stock_quantity, req.user?.id || null
            ]);

            const productId = productResult.rows[0].id;

            // Özel alanları ekle
            if (customFields && customFields.length > 0) {
                for (const field of customFields) {
                    await db.query(`
                        INSERT INTO product_custom_fields (
                            product_id, name, field_type, is_required, options
                        )
                        VALUES ($1, $2, $3, $4, $5)
                    `, [productId, field.name, field.field_type, field.is_required, field.options]);
                }
            }

            // Varyantları ekle
            if (variants && variants.length > 0) {
                for (const variant of variants) {
                    await db.query(`
                        INSERT INTO product_variants (
                            product_id, name, options, price_adjustment
                        )
                        VALUES ($1, $2, $3, $4)
                    `, [productId, variant.name, variant.options, variant.price_adjustment]);
                }
            }

            // Görselleri işle ve kaydet
            if (req.files && req.files.length > 0) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];
                    await db.query(`
                        INSERT INTO product_images (
                            product_id, file_name, file_path, file_size,
                            mime_type, sort_order
                        )
                        VALUES ($1, $2, $3, $4, $5, $6)
                    `, [
                        productId,
                        file.filename,
                        file.path,
                        file.size,
                        file.mimetype,
                        i
                    ]);
                }
            }

            res.status(201).json({ id: productId, message: 'Ürün başarıyla oluşturuldu' });
        } catch (error) {
            console.error('Ürün oluşturulurken hata:', error);
            res.status(500).json({ error: 'Ürün oluşturulurken bir hata oluştu' });
        }
    }

    // Ürün güncelle
    static async update(req, res) {
        try {
            const { id } = req.params;
            const {
                code,
                name,
                description,
                category_id,
                type,
                unit_id,
                base_price,
                currency,
                status,
                tax_rate,
                min_quantity,
                max_quantity,
                stock_tracking,
                stock_quantity,
                customFields,
                variants
            } = req.body;

            // Sayısal değerlerin kontrolü ve varsayılan değer ataması
            const sanitizedValues = {
                base_price: parseFloat(base_price) || 0,
                tax_rate: parseFloat(tax_rate) || 0,
                min_quantity: parseInt(min_quantity, 10) || 0,
                max_quantity: parseInt(max_quantity, 10) || 0,
                stock_quantity: parseInt(stock_quantity, 10) || 0,
                category_id: category_id === null || category_id === undefined || category_id === '' ? null : parseInt(category_id, 10),
                unit_id: unit_id === null || unit_id === undefined || unit_id === '' ? null : parseInt(unit_id, 10)
            };

            // Sayısal değerlerin geçerliliğini kontrol et
            if (isNaN(sanitizedValues.base_price)) sanitizedValues.base_price = 0;
            if (isNaN(sanitizedValues.tax_rate)) sanitizedValues.tax_rate = 0;
            if (isNaN(sanitizedValues.min_quantity)) sanitizedValues.min_quantity = 0;
            if (isNaN(sanitizedValues.max_quantity)) sanitizedValues.max_quantity = 0;
            if (isNaN(sanitizedValues.stock_quantity)) sanitizedValues.stock_quantity = 0;
            
            // Ana ürün bilgilerini güncelle
            await db.query(`
                UPDATE products
                SET code = $1, 
                    name = $2, 
                    description = $3, 
                    category_id = $4,
                    type = $5, 
                    unit_id = $6, 
                    base_price = $7, 
                    currency = $8,
                    status = $9, 
                    tax_rate = $10, 
                    min_quantity = $11,
                    max_quantity = $12, 
                    stock_tracking = $13, 
                    stock_quantity = $14,
                    updated_at = CURRENT_TIMESTAMP, 
                    updated_by = $15
                WHERE id = $16
            `, [
                code, 
                name, 
                description, 
                sanitizedValues.category_id,
                type, 
                sanitizedValues.unit_id,
                sanitizedValues.base_price, 
                currency,
                status, 
                sanitizedValues.tax_rate, 
                sanitizedValues.min_quantity,
                sanitizedValues.max_quantity, 
                stock_tracking, 
                sanitizedValues.stock_quantity,
                req.user?.id || null, 
                id
            ]);

            // Özel alanları güncelle
            await db.query('DELETE FROM product_custom_fields WHERE product_id = $1', [id]);
            if (customFields && customFields.length > 0) {
                for (const field of customFields) {
                    // Özel alan verilerini doğrula
                    const sanitizedField = {
                        name: field.name || '',
                        field_type: field.field_type || 'text',
                        is_required: field.is_required || false,
                        options: field.options || null
                    };

                    // Boş isim kontrolü
                    if (!sanitizedField.name.trim()) {
                        continue; // Boş isimli alanları atla
                    }

                    await db.query(`
                        INSERT INTO product_custom_fields (
                            product_id, name, field_type, is_required, options
                        )
                        VALUES ($1, $2, $3, $4, $5)
                    `, [
                        id,
                        sanitizedField.name,
                        sanitizedField.field_type,
                        sanitizedField.is_required,
                        sanitizedField.options
                    ]);
                }
            }

            // Varyantları güncelle
            await db.query('DELETE FROM product_variants WHERE product_id = $1', [id]);
            if (variants && variants.length > 0) {
                for (const variant of variants) {
                    // Varyant verilerini doğrula
                    const sanitizedVariant = {
                        name: variant.name || '',
                        options: variant.options || null,
                        price_adjustment: parseFloat(variant.price_adjustment) || 0
                    };

                    // Boş isim kontrolü
                    if (!sanitizedVariant.name.trim()) {
                        continue; // Boş isimli varyantları atla
                    }

                    await db.query(`
                        INSERT INTO product_variants (
                            product_id, name, options, price_adjustment
                        )
                        VALUES ($1, $2, $3, $4)
                    `, [
                        id,
                        sanitizedVariant.name,
                        sanitizedVariant.options,
                        sanitizedVariant.price_adjustment
                    ]);
                }
            }

            // Yeni görselleri ekle
            if (req.files && req.files.length > 0) {
                const currentImages = await db.query(
                    'SELECT sort_order FROM product_images WHERE product_id = $1 ORDER BY sort_order DESC LIMIT 1',
                    [id]
                );
                let lastSortOrder = currentImages.rows[0]?.sort_order || -1;

                for (const file of req.files) {
                    lastSortOrder++;
                    await db.query(`
                        INSERT INTO product_images (
                            product_id, file_name, file_path, file_size,
                            mime_type, sort_order
                        )
                        VALUES ($1, $2, $3, $4, $5, $6)
                    `, [
                        id,
                        file.filename,
                        file.path,
                        file.size,
                        file.mimetype,
                        lastSortOrder
                    ]);
                }
            }

            res.json({ message: 'Ürün başarıyla güncellendi' });
        } catch (error) {
            console.error('Ürün güncellenirken hata:', error);
            res.status(500).json({ error: 'Ürün güncellenirken bir hata oluştu' });
        }
    }

    // Ürün sil
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // İlişkili kayıtları sil
            await db.query('DELETE FROM product_custom_fields WHERE product_id = $1', [id]);
            await db.query('DELETE FROM product_variants WHERE product_id = $1', [id]);
            await db.query('DELETE FROM product_images WHERE product_id = $1', [id]);

            // Ürünü sil
            await db.query('DELETE FROM products WHERE id = $1', [id]);

            res.json({ message: 'Ürün başarıyla silindi' });
        } catch (error) {
            console.error('Ürün silinirken hata:', error);
            res.status(500).json({ error: 'Ürün silinirken bir hata oluştu' });
        }
    }
}

module.exports = ProductController; 