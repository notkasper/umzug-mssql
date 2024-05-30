# 🚚 Umzug Custom Storage for MSSQL 🛢️

A custom storage implementation for [Umzug](https://github.com/sequelize/umzug) - the database migration tool, specifically designed for Microsoft SQL Server (MSSQL). This storage solution allows you to manage and track your database migrations seamlessly.

## Features 🌟

- 📦 Store your migration data directly in MSSQL.
- 🔄 Seamlessly integrate with your existing Umzug setup.
- 🛠️ Easily manage, track, and execute database migrations.
- 💡 Leverage the power of Umzug with MSSQL databases.

## Installation 📥

To install this custom storage, use npm or yarn:

```bash
npm install umzug-mssql

# OR

yarn add umzug-mssql
```

Usage 🚀

```js
// Import necessary modules
import { Umzug } from "umzug";
import UmzugMssql from "umzug-mssql";
import { getPool } from "./mssql";

(async () => {
  // Create instance

  const options = {
    // Optional config object
    schema: "dbo",
    tableName: "Migrations",
  };
  const umzug = new Umzug({
    storage: new UmzugMssql(await getPool(), options),
    logger: console,
    migrations: {
      glob: "**/migrations/*.js",
    },
  });

  // Perform migrations
  umzug
    .up()
    .then((migrations) => {
      console.log("Migrations executed:", migrations);
    })
    .catch((error) => {
      console.error("Error executing migrations:", error);
    });
})();
```

Contributing 🤝
Contributions are welcome! If you find any issues or have ideas for improvements, feel free to open an issue or submit a pull request.

License 📄
This project is licensed under the MIT License - see the LICENSE.md file for details.
