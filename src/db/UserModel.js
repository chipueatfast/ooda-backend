import Sequelize from 'sequelize';
import sequelize from './sequelize';

const User = () => sequelize().define('user', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    managerId: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },

})

export default User;

