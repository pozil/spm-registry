# Salesforce Package Manager (SPM) Registry

This repository contains the SPM registry.<br/>
Head over here for the [Salesforce CLI plugin]().

## Environment Variables

| Property                      | Required | Description                                     | Example/Default                             |
| ----------------------------- | -------- | ----------------------------------------------- | ------------------------------------------- |
| `DATABASE_URL`                | true     | Database connection string                      | `postgres://user:password@host:port/dbname` |
| `DATABASE_REQUIRES_SSL`       | true     | Whether your database requires a SSL connection | `false`                                     |
| `SF_LOGIN_URL`                | true     | My domain base URL of your Salesforce org       | `https://my-org.lightning.force.com`        |
| `SF_USERNAME`                 | true     | Salesforce username                             | `user@my.org`                               |
| `SF_PASSWORD`                 | true     | Salesforce pasword                              | `pass123`                                   |
| `DATABASE_CONNECTION_TIMEOUT` | false    | Database connection timeout duration in seconds | `10000`                                     |
| `DATABASE_MAX_POOL_CLIENT`    | false    | Maximum number of client in database pool       | `10`                                        |
