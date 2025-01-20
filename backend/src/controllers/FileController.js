const BaseController = require('./BaseController');
const FileService = require('../services/FileService');

class FileController extends BaseController {
    static async create(req, res) {
        try {
            const { entityType, entityId } = req.params;
            const file = req.file;
            
            if (!file) {
                return BaseController.sendError(res, new Error('Dosya yüklenemedi'), 400);
            }

            const fileData = {
                entity_type: entityType,
                entity_id: entityId,
                file_name: file.filename,
                original_name: file.originalname,
                mime_type: file.mimetype,
                size: file.size,
                path: file.path
            };

            const result = await FileService.create(fileData);
            return BaseController.sendSuccess(res, result, 'Dosya başarıyla yüklendi', 201);
        } catch (error) {
            return BaseController.sendError(res, error);
        }
    }

    static async getAll(req, res) {
        try {
            const files = await FileService.getAll();
            return BaseController.sendSuccess(res, files, 'Dosyalar başarıyla getirildi');
        } catch (error) {
            return BaseController.sendError(res, error);
        }
    }

    static async getById(req, res) {
        try {
            const file = await FileService.getById(req.params.id);
            return BaseController.sendSuccess(res, file, 'Dosya başarıyla getirildi');
        } catch (error) {
            return BaseController.sendError(res, error);
        }
    }

    static async delete(req, res) {
        try {
            await FileService.delete(req.params.id);
            return BaseController.sendSuccess(res, null, 'Dosya başarıyla silindi');
        } catch (error) {
            return BaseController.sendError(res, error);
        }
    }
}

module.exports = FileController; 