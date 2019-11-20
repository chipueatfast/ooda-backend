import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { getPasswordHash, getUserCredential } from '~/util/authentication';
import { getRowBySingleValueAsync, } from '~/util/database';

export const getAccessToken = (accessToken) => {
    const verifiedToken = jwt.verify(accessToken, process.env.SECRET);
    verifiedToken.accessTokenExpiresAt = new Date(verifiedToken.accessTokenExpiresAt);
    return verifiedToken;
};

const saveToken = (token, client, user) => {
    const {
        accessTokenExpiresAt,
    } = token;
    const {
        username,
        role,
        id,
    } = user;
    token.accessToken = jwt.sign({
        user: {
            id,
            username,
            role,
        },
        accessTokenExpiresAt,
    }, process.env.SECRET);
    token.client = client;
    token.user = {
        id,
        username,
        role,
    };

    return token;
};

const revokeToken = () => {

    // this can be where we store the blacklist
    return true;
};

const getUser = async (username, password) => {

    const passwordHash = await getPasswordHash(username);
    if (bcrypt.compareSync(password, passwordHash)) {
        return await getUserCredential(username);
    }

    return null;

    // if (username === 'poppy' && password === 'hammer') {
    //     return {
    //         fullname: 'Poppy',
    //         role: 'staff',
    //     }
    // }

    // if (username === 'lulu' && password == 'pix') {
    //     return {
    //         fullname: 'Lulu',
    //         role: 'hr',
    //     }
    // }
    // return null;
};

const getClient = (clientId, clientSecret) => {
    if (clientId === 'ooda' && clientSecret === 'secret') {
        return {
            grants: [
                'password',
                'refresh_token',
            ],
        }
    }
};

export default {
    getAccessToken,
    getClient,
    getUser,
    saveToken,
    revokeToken,
}
