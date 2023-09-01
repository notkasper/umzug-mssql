import { ConnectionPool } from "mssql";
import { MigrationParams, UmzugStorage } from "umzug";
type Config = {
    schema: string;
    tableName: string;
};
declare class CustomStorage implements UmzugStorage {
    pool: ConnectionPool;
    schema: string;
    tableName: string;
    constructor(pool: ConnectionPool, config?: Config);
    ensureMigrationTableExists: () => Promise<void>;
    logMigration: (params: MigrationParams<unknown>) => Promise<void>;
    unlogMigration: (params: MigrationParams<unknown>) => Promise<void>;
    executed: (meta: Pick<MigrationParams<unknown>, "context">) => Promise<any[]>;
}
export default CustomStorage;
