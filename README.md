# Salesforce Package Manager (SPM) Registry

This repository contains the code for the [SPM registry](https://spm-registry.herokuapp.com/).<br/>
Head over here for the [SPM plugin for the Salesforce CLI](https://github.com/pozil/spm-plugin).

## Setup

1. Create a database with the [db_init.sql](db_init.sql) creation script.
1. Set up the environment variables (see next section).
1. Start the server with `npm start`.

## Environment Variables

| Property                      | Required | Description                                     | Example/Default                             |
| ----------------------------- | -------- | ----------------------------------------------- | ------------------------------------------- |
| `DATABASE_URL`                | true     | Database connection string                      | `postgres://user:password@host:port/dbname` |
| `DATABASE_REQUIRES_SSL`       | true     | Whether your database requires a SSL connection | `false`                                     |
| `SF_LOGIN_URL`                | true     | My domain base URL of your Salesforce org       | `https://my-org.lightning.force.com`        |
| `SF_USERNAME`                 | true     | Salesforce username                             | `user@my.org`                               |
| `SF_PASSWORD`                 | true     | Salesforce password                             | `pass123`                                   |
| `DATABASE_CONNECTION_TIMEOUT` | false    | Database connection timeout duration in seconds | `10000`                                     |
| `DATABASE_MAX_POOL_CLIENT`    | false    | Maximum number of clients in database pool      | `10`                                        |
