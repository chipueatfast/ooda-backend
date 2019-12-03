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
    phoneNumber: {
        type: Sequelize.STRING,
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
    },
    department: {
        type: Sequelize.ENUM('it', 'hr'),
    },
    joinDate: {
        type: Sequelize.DATE,
    },
    title: {
        type: Sequelize.STRING,
    },
    address: {
        type: Sequelize.STRING,
    },
    dob: {
        type: Sequelize.DATE,
    },
    bankAccount: {
        type: Sequelize.STRING,
    },
    idCard: {
        type: Sequelize.STRING,
    },
})

export default User;

