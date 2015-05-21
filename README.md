# BaseKit (REACT-REFLUX-NODE-EXPRESS-POSTGRES)

## Getting Started Developing Locally

#### Requirements
- Node.js installed on your computer. [link](http://blog.teamtreehouse.com/install-node-js-npm-mac)
- PostgreSQL installed on your computer. [link](http://postgresapp.com/)

#### Setup
1. Clone this repo locally.
2. In terminal enter repo and execute to install all dependencies: `$ npm install`.
3. Open up repo in your text editor of choice and create a new file `.env`.
4. Paste local variable `NODE_ENV=development` into it and save.
5. Open PSQL App and run PostgreSQL server
6. In PSQL terminal window create database todo: `CREATE DATABASE todo;`.
7. Check if database is created with: `\l`.
8. Enter todo database with: `\c todo`.
8. In another terminal window execute: `npm install -g db-migrate`. [link](https://github.com/db-migrate/node-db-migrate)
10. In terminal enter child directory: `todo-app/lib/api/db/`.
11. Execute db-migrate to create database schema: `db-migrate up`.

#### Local Deployment ( running at localhost:5000 )

```
$ gulp
```

#### Useful Tools
- Postico PostgreSQL Client for Mac [link](https://eggerapps.at/postico/)
