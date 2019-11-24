import Sequelize from 'sequelize';
import { createSingleRowAsync } from '~/util/database';
import tables from '~/db/index';
import sequelize from '~/db/sequelize';
import systemParameters from '~/db/parameters.json';

const getRemainingAnnualLeave = async ({
    submitterId,
}) => {
    const sum = await tables().LeaveRequest.sum('numberOfDays', {
        where: {
            submitterId,
            status: {
                [Sequelize.Op.in]: ['PENDING', 'APPROVED'],
            },
        },
    });
    return systemParameters.TOTAL_OF_ANNUAL_LEAVE - sum;
}

const isLeaveRequestValid = async ({
    submitterId,
    numberOfDays,
}) => {
    const remainingAnnualLeave = await getRemainingAnnualLeave({submitterId});
    if (remainingAnnualLeave < numberOfDays) {
        return false;
    }
    return true;
}

const createLeaveRequest = async (req, res) => {
    const {
        numberOfDays,
        reason,
        fromDate,
        toDate,
    } = req.body;
    const {
        userId: submitterId,
    } = req.params;
    if (!(submitterId && numberOfDays && reason)) {
        return res.status(400).send();
    }
    if (! await isLeaveRequestValid({
        submitterId,
        numberOfDays,
    })) {
        return res.status(400).json({
            message: 'Exceed allowed',
        }).send();
    }
    const newLeaveBalanceRequest = await createSingleRowAsync('LeaveRequest', {
        submitterId,
        numberOfDays,
        reason,
        status: 'PENDING',
        fromDate,
        toDate,
    });

    if (!newLeaveBalanceRequest.error) {
        return res.status(201).send(newLeaveBalanceRequest);
    } else {
        const {
            statusCode,
            message,
        } = newLeaveBalanceRequest.error;
        return res.status(statusCode).send(message);
    }
}
const getLeaveRequestByManager = async (req, res) => {
    const {
        managerId,
    } = req.params;

    const leaveRequests = await sequelize().query(
        'select lr.* from leave_requests lr ' +
        'join users u on u.id = lr.submitterId ' + 
        'where u.managerId = :managerId and status=\'PENDING\'',
        { replacements: { managerId }, type: Sequelize.QueryTypes.SELECT }
    );
    
    if (!leaveRequests || leaveRequests.length === 0) {
        return res.status(404).send();
    }
    return res.status(200).json({
        leaveRequests,
    }).send()
}

const getLeaveRequestByUserId = async (req, res) => {
    const {
        userId: submitterId,
    } =  req.params;
    const leaveRequests = await tables().LeaveRequest.findAll({
        where: {
            submitterId,
        },
    });
    if (!leaveRequests || leaveRequests.length === 0) {
        return res.status(404).send();
    }
    return res.status(200).json({
        leaveRequests,
    }).send()
}

const getLeaveBalance = () => {}
const updateLeaveRequest = async (req, res) => {
    const {
        leaveRequestId,
        decision,
    } = req.body;
    const leaveRequest = await tables().LeaveRequest.findOne({
        where: {
            id: leaveRequestId,
            status: 'PENDING',
        },
    });
    if (!leaveRequest) {
        return res.status(400).send();
    }
    await leaveRequest.update({
        status: decision,
    });
    return res.status(204).send();
}

export default {
    createLeaveRequest,
    getLeaveRequestByManager,
    getLeaveRequestByUserId,
    getLeaveBalance,
    updateLeaveRequest,
}