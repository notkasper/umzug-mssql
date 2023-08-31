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
In your Umzug configuration, set up the custom storage like this:

```js
const Umzug = require("umzug");
const UmzugMssqlStorage = require("umzug-mssql");

new Umzug({
  storage: new UmzugMssqlStorage(mssqlConnectionPool),
  logger: console,
  migrations: {
    glob: "*/migrations/*.js",
  },
});
```

Configuration Options ⚙️

mssqlConnectionPool: Mssql connection pool instance

Here's an example of how to use Umzug with MSSQL custom storage:

```js
// Import necessary modules
const Umzug = require("umzug");
const UmzugMssqlStorage = require("umzug-mssql");

// Create an Umzug instance
const umzug = new Umzug({
  storage: new UmzugMssqlStorage(mssqlConnectionPool),
  // Other Umzug configuration options...
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
```

Contributing 🤝
Contributions are welcome! If you find any issues or have ideas for improvements, feel free to open an issue or submit a pull request.

License 📄
This project is licensed under the MIT License - see the LICENSE.md file for details.
