import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const getAccessToken = (accessToken) => {
    const verifiedToken = jwt.verify(accessToken, process.env.SECRET);
    verifiedToken.accessTokenExpiresAt = new Date(verifiedToken.accessTokenExpiresAt);
    return verifiedToken;
};

const saveToken = (token, client, user) => {
    const {
        refreshToken,
        accessTokenExpiresAt,
    } = token;
    const {
        fullname,
        email,
    } = user;
    token.accessToken = jwt.sign({
        user: {
            fullname,
        },
        accessTokenExpiresAt,
    }, process.env.SECRET);
    token.client = client;
    token.user = {
        fullname,
    };

    return token;
};

const getRefreshToken = async (refreshToken) => {

    const user = {
        fullname: 'Poppy',
    };
    if (!user) {
        return null;
    }

    return {
        refreshToken,
        client: {
            clientId: 'ooda',
            clientSecret: 'secret',
        },
        user: user.dataValues,
    }
};
const revokeToken = (token) => {

    // this can be where we store the blacklist
    return true;
};

const getUser = async (username, password) => {

    if (username === 'poppy' && password === 'hammer') {
        return {
            fullname: 'Poppy',
        }
    }
    return null;
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
    getRefreshToken,
    getClient,
    getUser,
    saveToken,
    revokeToken,
}