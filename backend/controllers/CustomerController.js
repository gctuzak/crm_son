const { Company, Person, CompanyEmployee } = require('../models/Customer');

// Şirket işlemleri
const createCompany = async (req, res) => {
  try {
    const companyData = {
      ...req.body,
      created_by: req.user.id
    };

    const company = await Company.create(companyData);
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id);
    
    if (!company) {
      return res.status(404).json({ error: 'Şirket bulunamadı' });
    }

    await company.update(req.body);
    res.json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id, {
      include: [{
        model: CompanyEmployee,
        include: [Person]
      }]
    });
    
    if (!company) {
      return res.status(404).json({ error: 'Şirket bulunamadı' });
    }

    res.json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      order: [['name', 'ASC']]
    });
    res.json(companies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Kişi işlemleri
const createPerson = async (req, res) => {
  try {
    const { companyRelation, ...personData } = req.body;
    personData.created_by = req.user.id;

    const person = await Person.create(personData);

    if (companyRelation) {
      await CompanyEmployee.create({
        person_id: person.id,
        company_id: companyRelation.companyId,
        position: companyRelation.position,
        department: companyRelation.department,
        is_active: companyRelation.is_active,
        created_by: req.user.id
      });
    }

    res.status(201).json(person);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyRelation, ...personData } = req.body;
    
    const person = await Person.findByPk(id);
    if (!person) {
      return res.status(404).json({ error: 'Kişi bulunamadı' });
    }

    await person.update(personData);

    if (companyRelation) {
      await CompanyEmployee.upsert({
        person_id: person.id,
        company_id: companyRelation.companyId,
        position: companyRelation.position,
        department: companyRelation.department,
        is_active: companyRelation.is_active,
        created_by: req.user.id
      });
    }

    res.json(person);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await Person.findByPk(id, {
      include: [{
        model: CompanyEmployee,
        include: [Company]
      }]
    });
    
    if (!person) {
      return res.status(404).json({ error: 'Kişi bulunamadı' });
    }

    res.json(person);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllPersons = async (req, res) => {
  try {
    const persons = await Person.findAll({
      order: [['name', 'ASC'], ['surname', 'ASC']]
    });
    res.json(persons);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Şirket çalışanları işlemleri
const getCompanyEmployees = async (req, res) => {
  try {
    const { companyId } = req.params;
    const employees = await CompanyEmployee.findAll({
      where: { company_id: companyId },
      include: [Person],
      order: [[Person, 'name', 'ASC']]
    });
    res.json(employees);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCompanyEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await CompanyEmployee.findByPk(id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Çalışan kaydı bulunamadı' });
    }

    await employee.update(req.body);
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createCompany,
  updateCompany,
  getCompany,
  getAllCompanies,
  createPerson,
  updatePerson,
  getPerson,
  getAllPersons,
  getCompanyEmployees,
  updateCompanyEmployee
}; 