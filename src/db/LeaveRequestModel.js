import Sequelize from 'sequelize';
import sequelize from './sequelize';

const LeaveRequest = () => sequelize().define('leave_request', {
    submitterId: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM('pending', 'rejected', 'approved'),
        allowNull: false,
    },
    numberOfDays: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    reason: {
        type: Sequelize.STRING,
        allowNull: false,
    },
})

export default LeaveRequest;

