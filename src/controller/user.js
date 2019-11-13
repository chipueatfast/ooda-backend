import { createSingleRowAsync, getRowBySingleValueAsync } from '~/util/database';


const createUser = async (req, res) => {
    const newUser = await createSingleRowAsync(
        'User',
        req.body,
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
};
