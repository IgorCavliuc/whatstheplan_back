require('dotenv').config();
const { DataSource } = require('typeorm');
const path = require('path');

module.exports = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, 'dist', 'src', 'user', 'entities', '*.js')],
  migrations: [path.join(__dirname, 'dist', 'src', 'migrations', '*.js')],
  synchronize: false,
});
