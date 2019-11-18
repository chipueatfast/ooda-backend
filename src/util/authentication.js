import tables from '~/db/index';

export function getPasswordHash(username) {
    return tables().User.findOne({
        where: {
            email: username,
        },
    }).then(user => user ? user.passwordHash : null);
}

export function getUserCredential(username) {
    return tables().User.findOne({
        where: {
            email: username,
        },
    }).then(user => user);
}

