class BaseController {
    // Başarılı yanıt gönderme
    static sendSuccess(res, data, message = '', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            data,
            message
        });
    }

    // Hata yanıtı gönderme
    static sendError(res, error, statusCode = 400) {
        console.log('BaseController.sendError:', error);
        
        // Hata mesajını hazırla
        const errorMessage = error instanceof Error ? error.message : error;
        
        return res.status(statusCode).json({
            success: false,
            error: errorMessage,
            data: null
        });
    }

    // Sayfalama parametrelerini hazırlama
    static getPaginationParams(req) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        return {
            page,
            limit,
            offset
        };
    }

    // Sıralama parametrelerini hazırlama
    static getSortParams(req) {
        const sortField = req.query.sortBy || 'created_at';
        const sortOrder = req.query.sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';

        return {
            sortField,
            sortOrder
        };
    }

    // Arama parametrelerini hazırlama
    static getSearchParams(req, allowedFields) {
        const searchParams = {};
        
        allowedFields.forEach(field => {
            if (req.query[field]) {
                searchParams[field] = req.query[field];
            }
        });

        return searchParams;
    }

    static sendPaginatedSuccess(res, data, page, limit, total) {
        return res.json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
}

module.exports = BaseController; 