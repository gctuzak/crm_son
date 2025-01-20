const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Şirket modeli
const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('anonim', 'limited', 'sahis', 'diger'),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    validate: {
      isEmail: true
    }
  },
  phone: DataTypes.STRING(20),
  website: DataTypes.STRING(255),
  sector: {
    type: DataTypes.ENUM('technology', 'manufacturing', 'retail', 'service', 'other'),
    allowNull: true
  },
  tax_office: DataTypes.STRING(255),
  tax_number: {
    type: DataTypes.STRING(50),
    validate: {
      len: [10, 10]
    }
  },
  customer_representative: DataTypes.STRING(255),
  address: DataTypes.TEXT,
  city: DataTypes.STRING(50),
  district: DataTypes.STRING(50),
  postal_code: DataTypes.STRING(10),
  country: {
    type: DataTypes.STRING(50),
    defaultValue: 'Türkiye'
  },
  notes: DataTypes.TEXT,
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Companies',
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

// Kişi modeli
const Person = sequelize.define('Person', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  surname: DataTypes.STRING(100),
  title: DataTypes.STRING(50),
  customer_category: {
    type: DataTypes.ENUM('individual', 'employee', 'freelancer'),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    validate: {
      isEmail: true
    }
  },
  phone: DataTypes.STRING(20),
  identity_number: {
    type: DataTypes.CHAR(11),
    validate: {
      len: [11, 11]
    }
  },
  address: DataTypes.TEXT,
  city: DataTypes.STRING(50),
  district: DataTypes.STRING(50),
  postal_code: DataTypes.STRING(10),
  country: {
    type: DataTypes.STRING(50),
    defaultValue: 'Türkiye'
  },
  customer_representative: DataTypes.STRING(255),
  email_subscription: {
    type: DataTypes.ENUM('active', 'cancelled'),
    defaultValue: 'active'
  },
  notes: DataTypes.TEXT,
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Persons',
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

// Şirket Çalışanları modeli
const CompanyEmployee = sequelize.define('CompanyEmployee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  person_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Persons',
      key: 'id'
    }
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    }
  },
  position: DataTypes.STRING(100),
  department: DataTypes.STRING(100),
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'CompanyEmployees',
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

// İlişkileri tanımlama
Company.hasMany(CompanyEmployee);
CompanyEmployee.belongsTo(Company);

Person.hasMany(CompanyEmployee);
CompanyEmployee.belongsTo(Person);

module.exports = {
  Company,
  Person,
  CompanyEmployee
}; 