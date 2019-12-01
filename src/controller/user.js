import { createSingleRowAsync, getRowBySingleValueAsync } from '~/util/database';
import { generatePasswordHash } from '~/util/encryption';
import tables from '~/db/index';

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

export default {
    createUser,
    getUserById,
    isManager,
};
