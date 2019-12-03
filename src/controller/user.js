import Sequelize from 'sequelize';
import sequelize from '~/db/sequelize';
import { createSingleRowAsync, getRowBySingleValueAsync } from '~/util/database';
import { generatePasswordHash } from '~/util/encryption';
import tables from '~/db/index';

const findAllEmployees = async (req, res) => {

    const employees = await sequelize().query(
        'select u1.*, u2.username as \'managerName\' ' + 
        'from users u1 left join users u2 on u1.managerId = u2.id', {
            type: Sequelize.QueryTypes.SELECT,
        }
    )
    if (employees) {
        return res.json({
            employees,
        }).send();
    }
    res.status(500).send();
}

const updateEmployeeInfo = async (req, res) => {
    const {
        employeeId,
        phoneNumber,
        address,
        bankAccount,
        idCard,
        dob,
    } = req.body;

    const existing = await tables().User.findOne({
        where: {
            id: employeeId,
        },
    })
    if (!existing) {
        return res.status(400).json({
            message: 'NOT_EXIST',
        });
    }
    const rs = await existing.update({
        ...(phoneNumber ? { phoneNumber } : {}),
        ...(address ? { address } : {}),
        ...(bankAccount ? { bankAccount } : {}),
        ...(dob ? { dob } : {}),
        ...(idCard ? { idCard } : {}),
    })
    if (rs) {
        return res.status(204).send();
    }
    return res.status(500).send();
}

const createUser = async (req, res) => {
    const passwordHash = generatePasswordHash(req.body.password);
    const newUser = await createSingleRowAsync(
        'User',
        {
            ...req.body,
            passwordHash,
        },
        {
            email: req.body.email,
        }
    );
    if (!newUser.error) {
        return res.status(201).send(newUser);
    } else {
        const {
            statusCode,
            message,
        } = newUser.error;
        return res.status(statusCode).send(message);
    }
}

const isManager = async (req, res) => {
    const {
        userId,
    } = req.params;
    const inferior = await tables().User.findOne({
        where: {
            managerId: userId,
        },
    });
    return res.json({
        isManager: !!inferior,
    }).send();
}

const getUserById = async (req, res) => {
    const {
        id,
    } = req.params;
    const user = await getRowBySingleValueAsync('User', 'id', id);
    if (user) {
        return res.json(user).send();
    }
    return res.status(404).send();
}

const changePassword = async (req, res) => {
    const {
        userId,
    } = req.params;

    const {
        password,
    } = req.body;

    if (!password) {
        return res.status(400).send({
            message: 'EMPTY_PASSWORD',
        })
    }

    const changedUser = await tables().User.update({
        passwordHash: generatePasswordHash(password),
    },{
        where: {
            id: userId,
        },
    })

    if (changedUser) {
        return res.status(204).send();
    }

    res.status(500).send();
}

export default {
    createUser,
    getUserById,
    isManager,
    findAllEmployees,
    updateEmployeeInfo,
    changePassword,
};
