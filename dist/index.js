"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class CustomStorage {
    constructor(pool, config) {
        this.ensureMigrationTableExists = () => __awaiter(this, void 0, void 0, function* () {
            const query = `
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = '${this.tableName}')
    BEGIN
        CREATE TABLE ${this.tableName} (
            name NVARCHAR(255) NOT NULL,
            date DATETIME NOT NULL DEFAULT GETDATE()
        );
    END
    `;
            yield this.pool.request().input("tableName", this.tableName).query(query);
        });
        this.logMigration = (params) => __awaiter(this, void 0, void 0, function* () {
            yield this.ensureMigrationTableExists();
            yield this.pool
                .request()
                .input("name", params.name)
                .query(`INSERT INTO [dbo].[Migrations] (name) VALUES (@name)`);
        });
        this.unlogMigration = (params) => __awaiter(this, void 0, void 0, function* () {
            yield this.ensureMigrationTableExists();
            yield this.pool
                .request()
                .input("name", params.name)
                .query(`DELETE FROM ${this.schema}.${this.tableName} WHERE [name]=@name`);
        });
        this.executed = (meta) => __awaiter(this, void 0, void 0, function* () {
            yield this.ensureMigrationTableExists();
            const result = yield this.pool
                .request()
                .query(`SELECT [name] FROM [dbo].[Migrations] ORDER BY [date]`);
            const executed = result.recordset.map((record) => record.name);
            return executed;
        });
        this.pool = pool;
        // Set defaults and override with provided config
        this.schema = (config === null || config === void 0 ? void 0 : config.schema) || "dbo";
        this.tableName = (config === null || config === void 0 ? void 0 : config.tableName) || "Migrations";
    }
}
exports.default = CustomStorage;
