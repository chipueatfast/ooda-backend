# API documentation

localhost:2109/oauth/token - POST

-   Authentication: BasicAuth - ooda / secret
-   AcceptType: xxx-form-url-encoded
-   Body Parameters: 
    {
        grant_type: 'password',
        username: <USERNAME>,
        password: <PASSWORD>,
    }

-   Response: {
        user,
        refreshToken,
        accessToken,
    }