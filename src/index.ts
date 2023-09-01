import { ConnectionPool } from "mssql";
import { MigrationParams, UmzugStorage } from "umzug";

type Config = {
  schema: string;
  tableName: string;
};

class CustomStorage implements UmzugStorage {
  pool: ConnectionPool;
  schema: string;
  tableName: string;

  constructor(pool: ConnectionPool, config?: Config) {
    this.pool = pool;

    // Set defaults and override with provided config
    this.schema = config?.schema || "dbo";
    this.tableName = config?.tableName || "Migrations";
  }

  ensureMigrationTableExists = async () => {
    const query = `
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = '${this.tableName}')
    BEGIN
        CREATE TABLE ${this.tableName} (
            name NVARCHAR(255) NOT NULL,
            date DATETIME NOT NULL DEFAULT GETDATE()
        );
    END
    `;
    await this.pool.request().input("tableName", this.tableName).query(query);
  };

  logMigration = async (params: MigrationParams<unknown>) => {
    await this.ensureMigrationTableExists();
    await this.pool
      .request()
      .input("name", params.name)
      .query(
        `INSERT INTO ${this.schema}.${this.tableName} (name) VALUES (@name)`
      );
  };

  unlogMigration = async (params: MigrationParams<unknown>) => {
    await this.ensureMigrationTableExists();
    await this.pool
      .request()
      .input("name", params.name)
      .query(`DELETE FROM ${this.schema}.${this.tableName} WHERE [name]=@name`);
  };

  executed = async (meta: Pick<MigrationParams<unknown>, "context">) => {
    await this.ensureMigrationTableExists();
    const result = await this.pool
      .request()
      .query(
        `SELECT [name] FROM ${this.schema}.${this.tableName} ORDER BY [date]`
      );
    const executed = result.recordset.map((record) => record.name);
    return executed;
  };
}

export default CustomStorage;
