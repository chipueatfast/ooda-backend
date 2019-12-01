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
        'select u.id as \'uid\', username, title,' +
        'case ' +
        '	when period = :period and year = :year ' +
        '	then true ' +
        '	else false ' +
        'end as isReviewedLastPeriod ' +
        'from users u left join performance_reviews pr  ' +
        'on u.id = pr.revieweeId ' +
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
    } = getLastPRWindow();
    const {
        revieweeId,
    } = req.body;
    if (!(year && period && reviewerId && revieweeId)) {
        return res.status(400).json({
            message: 'MISSING FIELD',
        }).send();
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
    if (newPR.error) {
        return res.status(400).json(newPR.error).send();
    }
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
        return res.status(400).json({
            message: 'Object to update does not exist',
        }).send();
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

    const existingPR = await tables().PerformanceReview.findOne({
        where: {
            id: prId,
        },
    })

    if (!existingPR) {
        return res.status(400).send({
            message: 'does not exist',
        });
    }

    if (!existingPR.note || !existingPR.KPI) {
        return res.status(400).send({
            message: 'NOT_FULFILED',
        });
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


    const PRs = await sequelize().query(
        'select pr.id, u.username as \'managerName\', pr.note, pr.KPI ' +
        'from performance_reviews pr ' +
        'join users u on u.id = pr.reviewerId ' +
        'where pr.revieweeId = :userId and pr.isFinalized = true', {
            replacements: {
                userId: parseInt(userId),
            },
            type: Sequelize.QueryTypes.SELECT,
        }
    );
    return res.json({
        history: PRs,
    }).send();
}

const getConductedPR = async (req, res) => {
    const {
        managerId,
    } = req.params;

    const conducteds = await sequelize().query(
        'select pr.id, year, period, username, title, KPI, note, isFinalized from ' +
        'performance_reviews pr ' +
        'join users u on pr.revieweeId = u.id ' +
        'where managerId = :managerId', {
            replacements: {
                managerId: parseInt(managerId),
            },
            type: Sequelize.QueryTypes.SELECT,
        }
    );
    return res.json({
        conducteds,
    }).send();
}

const getPerformanceReviewableList = async (req, res) => {
    const {
        managerId,
    } =  req.params;
    const {
        year,
        period,
    } = getLastPRWindow();
    const employeeList = await getManagedEmployee(managerId);
    if (employeeList) {
        return res.json({
            employeeList,
            year,
            period,
        }).send();
    };
    return res.status(500).send();
}



const getToFinalize = async (req, res) => {
    const toFinalize = await sequelize().query(
        'select pr.id, u2.username as \'managerName\', year, period, u.username as \'username\', u.title as \'title\', KPI, note, isFinalized from  ' +
        'performance_reviews pr  ' +
        'join users u on pr.revieweeId = u.id ' +
        'join users u2 on pr.reviewerId = u2.id ' +
        'where isFinalized = false ', {
            type: Sequelize.QueryTypes.SELECT,
        }
    );

    return res.json({
        toFinalize,
    }).send();
}

export default {
    getPerformanceReviewableList,
    createPerformanceReview,
    getPRHistory,
    getConductedPR,
    updatePerformanceReview,
    finalizePR,
    getToFinalize,
}