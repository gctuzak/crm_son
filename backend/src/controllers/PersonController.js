const BaseController = require('./BaseController');
const PersonService = require('../services/PersonService');

class PersonController extends BaseController {
    static async create(req, res, next) {
        try {
            const personData = req.body;
            const person = await PersonService.createPerson(personData);
            return BaseController.sendSuccess(res, person, 'Kişi başarıyla oluşturuldu', 201);
        } catch (error) {
            return BaseController.sendError(res, error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const persons = await PersonService.getAll();
            return BaseController.sendSuccess(res, persons);
        } catch (error) {
            return BaseController.sendError(res, error);
        }
    }

    static async getById(req, res, next) {
        try {
            console.log('PersonController.getById çağrıldı. ID:', req.params.id);
            const person = await PersonService.getById(req.params.id);
            return BaseController.sendSuccess(res, person);
        } catch (error) {
            console.log('PersonController.getById Error:', error);
            const statusCode = error.message.includes('bulunamadı') ? 404 : 400;
            return BaseController.sendError(res, error, statusCode);
        }
    }

    static async update(req, res, next) {
        try {
            const id = req.params.id;
            
            // ID kontrolü
            const numericId = parseInt(id);
            if (isNaN(numericId)) {
                return BaseController.sendError(res, new Error('Geçersiz ID formatı'));
            }

            const personData = req.body;
            console.log('Update isteği alındı. ID:', numericId, 'Data:', personData);

            const person = await PersonService.updatePerson(numericId, personData);
            return BaseController.sendSuccess(res, person, 'Kişi başarıyla güncellendi');
        } catch (error) {
            console.error('Update Error:', error);
            return BaseController.sendError(res, error);
        }
    }

    static async delete(req, res, next) {
        try {
            await PersonService.delete(req.params.id);
            return BaseController.sendSuccess(res, null, 'Kişi başarıyla silindi');
        } catch (error) {
            return BaseController.sendError(res, error);
        }
    }

    static async searchCompanies(req, res) {
        try {
            const { term } = req.query;
            const companies = await PersonService.searchCompanies(term);
            res.json(companies);
        } catch (error) {
            console.error('SearchCompanies Error:', error);
            res.status(400).json({ error: error.message });
        }
    }

    static async getStats(req, res) {
        try {
            const result = await PersonService.getStats();
            return BaseController.sendSuccess(res, result);
        } catch (error) {
            console.error('GetStats Error:', error);
            return BaseController.sendError(res, error);
        }
    }
}

module.exports = PersonController; 