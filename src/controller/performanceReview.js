import Sequelize from 'sequelize';
import sequelize from '~/db/sequelize';
import systemParameters from '~/db/parameters.json';
import { createSingleRowAsync } from '~/util/database';
import tables from '~/db/index';

const getLastPRWindow = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentPeriod = Math.ceil(now.getMonth() / systemParameters.PERIOD_DEF);
    if (currentPeriod === 1) {
        return {
            year: currentYear - 1,
            period: 12 / systemParameters.PERIOD_DEF,
        }
    }
    else {
        return {
            year: currentYear,
            period: currentPeriod - 1,
        };
    }
} 

const getManagedEmployee = async (managerId) => {
    const {
        period,
        year,
    } = getLastPRWindow();

    const employeesWithPRInfo = await sequelize().query(
        'select username, ' +
        'case ' +
        '	when period = :period and year = :year ' +
        '	then true ' +
        '	else false ' +
        'end as isReviewedLastPeriod ' +
        'from users u left join performance_reviews pr  ' +
        'on u.id = pr.reviewerId ' +
        'where managerId = :managerId', {
            replacements: {
                managerId: parseInt(managerId),
                period,
                year,
            },
            type: Sequelize.QueryTypes.SELECT,
        }
    )
    return employeesWithPRInfo;
}


const createPerformanceReview = async(req, res) => {
    const {
        managerId: reviewerId,
    } = req.params;
    const {
        year,
        period,
        revieweeId,
    } = req.body;
    if (!(year && period && reviewerId && revieweeId)) {
        return res.status(400).send();
    }

    const newPR = await createSingleRowAsync('PerformanceReview', {
        year,
        period,
        reviewerId,
        revieweeId,
    }, {
        year,
        period,
        reviewerId,
        revieweeId,
    });
    if (newPR) {
        return res.status(201).json({
            newPR,
        }).send();
    }
}

const updatePerformanceReview = async(req, res) => {
    const {
        prId,
        note,
        KPI,
    } = req.body;
    
    if (!prId) {
        return res.status(400).send();
    }

    const existingPR = await tables().PerformanceReview.findOne({
        where: {
            id: prId,
            isFinalized: false,
        },
    })
    if (!existingPR) {
        return res.status(400).send();
    }
    const updatedPr = await existingPR.update({
        note,
        KPI,
    });
    if (updatedPr) {
        return res.status(204).send();
    }
    res.status(500).send();
}

const finalizePR = async (req, res) => {
    const {
        prId,
    } = req.body;

    if (!prId) {
        return res.status(400).send();
    }

    const finalizedPR = await tables().PerformanceReview.update({
        isFinalized: true,
    },{
        where: {
            id: prId,
        },
    })
    if (finalizedPR) {
        return res.status(204).send();
    }
    res.status(500).send();
}

const getPRHistory = async (req, res) => {
    const {
        userId,
    } = req.params;

    const PRs = await tables().PerformanceReview.findAll({
        where: {
            revieweeId: userId,
            isFinalized: true,
        },
    });
    return res.json({
        history: PRs,
    }).send();
}

const getConductedPR = async (req, res) => {
    const {
        managerId,
    } = req.params;

    const PRs = await tables().PerformanceReview.findAll({
        where: {
            reviewerId: managerId,
        },
    });
    return res.json({
        conducteds: PRs,
    }).send();
}

const getPerformanceReviewableList = async (req, res) => {
    const {
        managerId,
    } =  req.params;
    const employeeList = await getManagedEmployee(managerId);
    if (employeeList) {
        return res.json({
            employeeList,
        }).send();
    };
    return res.status(500).send();
}

export default {
    getPerformanceReviewableList,
    createPerformanceReview,
    getPRHistory,
    getConductedPR,
    updatePerformanceReview,
    finalizePR,
}