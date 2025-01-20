const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validationContext = {
                body: req.body,
                query: req.query,
                params: req.params,
                files: req.files || req.file
            };

            const errors = [];

            // Her bir alan için validasyon kurallarını kontrol et
            Object.keys(schema).forEach(key => {
                const rules = schema[key];
                const value = validationContext[key];

                // Zorunlu alan kontrolü
                if (rules.required && !value) {
                    errors.push({
                        field: key,
                        message: `${key} alanı zorunludur`
                    });
                    return;
                }

                if (value) {
                    // Tip kontrolü
                    if (rules.type && typeof value !== rules.type) {
                        errors.push({
                            field: key,
                            message: `${key} alanı ${rules.type} tipinde olmalıdır`
                        });
                    }

                    // Minimum uzunluk kontrolü
                    if (rules.minLength && value.length < rules.minLength) {
                        errors.push({
                            field: key,
                            message: `${key} alanı en az ${rules.minLength} karakter olmalıdır`
                        });
                    }

                    // Maximum uzunluk kontrolü
                    if (rules.maxLength && value.length > rules.maxLength) {
                        errors.push({
                            field: key,
                            message: `${key} alanı en fazla ${rules.maxLength} karakter olmalıdır`
                        });
                    }

                    // Pattern kontrolü
                    if (rules.pattern && !rules.pattern.test(value)) {
                        errors.push({
                            field: key,
                            message: rules.message || `${key} alanı geçerli formatta değil`
                        });
                    }

                    // Enum kontrolü
                    if (rules.enum && !rules.enum.includes(value)) {
                        errors.push({
                            field: key,
                            message: `${key} alanı geçerli bir değer olmalıdır`
                        });
                    }

                    // Özel validasyon fonksiyonu
                    if (rules.validate && typeof rules.validate === 'function') {
                        const result = rules.validate(value);
                        if (result !== true) {
                            errors.push({
                                field: key,
                                message: result
                            });
                        }
                    }
                }
            });

            if (errors.length > 0) {
                return res.status(422).json({
                    success: false,
                    message: 'Validasyon hatası',
                    errors
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

// Yaygın validasyon şemaları
validate.schemas = {
    // Kullanıcı validasyon şemaları
    userRegister: {
        body: {
            email: {
                required: true,
                type: 'string',
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Geçerli bir e-posta adresi giriniz'
            },
            password: {
                required: true,
                type: 'string',
                minLength: 6,
                message: 'Şifre en az 6 karakter olmalıdır'
            },
            first_name: { required: true, type: 'string' },
            last_name: { required: true, type: 'string' }
        }
    },

    // Şirket validasyon şemaları
    companyCreate: {
        body: {
            name: { required: true, type: 'string' },
            type: {
                required: true,
                type: 'string',
                enum: ['anonim', 'limited', 'sahis', 'diger']
            },
            tax_number: {
                type: 'string',
                validate: (value) => value.length === 10 || 'Vergi numarası 10 haneli olmalıdır'
            }
        }
    },

    // Kişi validasyon şemaları
    personCreate: {
        body: {
            first_name: { required: true, type: 'string' },
            last_name: { required: true, type: 'string' },
            type: {
                required: true,
                type: 'string',
                enum: ['individual', 'employee', 'freelancer']
            },
            identity_number: {
                type: 'string',
                validate: (value) => value.length === 11 || 'TC Kimlik numarası 11 haneli olmalıdır'
            }
        }
    }
};

module.exports = validate; 