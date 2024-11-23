require('dotenv').config();

const config = {
    development: {
        port: process.env.PORT || 3000,
        db: {
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            dialect: 'mysql',
        },
    },
    production: {
        port: process.env.PORT || 80,
        db: {
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            dialect: 'mysql',
        },
    },
};

const environment = process.env.NODE_ENV || 'development';
module.exports = config[environment];
