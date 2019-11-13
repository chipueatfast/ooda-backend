import Sequelize from 'sequelize';

let sequelize;

export function initSequelize() {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, '', {
        host: 'localhost',
        dialect: 'mariadb',
    });
    sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}

export default () => sequelize;
