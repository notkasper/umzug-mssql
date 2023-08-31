import { MigrationParams, UmzugStorage, Umzug } from "umzug";
import { ConnectionPool } from "mssql";
import "./index";

class CustomStorage implements UmzugStorage {
  pool: ConnectionPool;

  constructor(pool: ConnectionPool) {
    this.pool = pool;
  }

  ensureMigrationTableExists = async () => {
    const query = `
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Migrations')
    BEGIN
        CREATE TABLE Migrations (
            name NVARCHAR(255) NOT NULL,
            date DATETIME NOT NULL DEFAULT GETDATE()
        );
    END
    `;
    await this.pool.request().query(query);
  };

  logMigration = async (params: MigrationParams<unknown>) => {
    await this.ensureMigrationTableExists();
    await this.pool
      .request()
      .input("name", params.name)
      .query(`INSERT INTO [dbo].[Migrations] (name) VALUES (@name)`);
  };

  unlogMigration = async (params: MigrationParams<unknown>) => {
    await this.ensureMigrationTableExists();
    await this.pool
      .request()
      .input("name", params.name)
      .query(`DELETE FROM [dbo].[Migrations] WHERE [name]=@name`);
  };

  executed = async (meta: Pick<MigrationParams<unknown>, "context">) => {
    await this.ensureMigrationTableExists();
    const result = await this.pool
      .request()
      .query(`SELECT [name] FROM [dbo].[Migrations] ORDER BY [date]`);
    const executed = result.recordset.map((record) => record.name);
    return executed;
  };
}

export default CustomStorage;
