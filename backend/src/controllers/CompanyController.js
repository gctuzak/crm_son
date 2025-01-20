const BaseController = require('./BaseController');
const CompanyService = require('../services/CompanyService');

class CompanyController extends BaseController {
    static async create(req, res, next) {
        try {
            const companyData = req.body;
            const company = await CompanyService.create(companyData);
            return BaseController.sendSuccess(res, company, 'Şirket başarıyla oluşturuldu', 201);
        } catch (error) {
            return BaseController.sendError(res, error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const companies = await CompanyService.getAll();
            return BaseController.sendSuccess(res, companies);
        } catch (error) {
            return BaseController.sendError(res, error);
        }
    }

    static async getById(req, res, next) {
        try {
            const company = await CompanyService.getById(req.params.id);
            return BaseController.sendSuccess(res, company);
        } catch (error) {
            return BaseController.sendError(res, error);
        }
    }

    static async update(req, res, next) {
        try {
            const companyData = req.body;
            const company = await CompanyService.update(req.params.id, companyData);
            return BaseController.sendSuccess(res, company, 'Şirket başarıyla güncellendi');
        } catch (error) {
            return BaseController.sendError(res, error);
        }
    }

    static async delete(req, res, next) {
        try {
            await CompanyService.delete(req.params.id);
            return BaseController.sendSuccess(res, null, 'Şirket başarıyla silindi');
        } catch (error) {
            return BaseController.sendError(res, error);
        }
    }

    static async search(req, res, next) {
        try {
            const { query } = req.query;
            const companies = await CompanyService.search(query);
            return BaseController.sendSuccess(res, companies);
        } catch (error) {
            return BaseController.sendError(res, error);
        }
    }
}

module.exports = CompanyController; 