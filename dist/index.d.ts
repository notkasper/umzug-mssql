import { MigrationParams, UmzugStorage } from "umzug";
import { ConnectionPool } from "mssql";
import "./index";
declare class CustomStorage implements UmzugStorage {
    pool: ConnectionPool;
    constructor(pool: ConnectionPool);
    ensureMigrationTableExists: () => Promise<void>;
    logMigration: (params: MigrationParams<unknown>) => Promise<void>;
    unlogMigration: (params: MigrationParams<unknown>) => Promise<void>;
    executed: (meta: Pick<MigrationParams<unknown>, "context">) => Promise<any[]>;
}
export default CustomStorage;
