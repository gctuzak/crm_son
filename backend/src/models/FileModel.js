const BaseModel = require('./BaseModel');

class FileModel extends BaseModel {
    constructor() {
        super('files');
    }

    async findByEntity(entityType, entityId) {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE entity_type = $1 AND entity_id = $2
        `;
        const result = await this.query(query, [entityType, entityId]);
        return result;
    }

    async findByUploader(uploaderId) {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE uploaded_by = $1
        `;
        const result = await this.query(query, [uploaderId]);
        return result;
    }
}

module.exports = new FileModel(); 