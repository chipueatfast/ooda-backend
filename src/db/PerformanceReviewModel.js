import Sequelize from 'sequelize';
import sequelize from './sequelize';

const PerformanceReview = () => sequelize().define('performance_review', {
    revieweeId: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    reviewerId: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    KPI: {
        type: Sequelize.NUMBER,
    },
    note: {
        type: Sequelize.STRING,
    },
    year: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    period: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    isFinalized: {
        type: Sequelize.BOOLEAN,
    },
})

export default PerformanceReview;

