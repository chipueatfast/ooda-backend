import Express from 'express';
import bodyParser from 'body-parser';
import {Request, Response} from 'oauth2-server';
import { PingRouter } from './route/index';
import oauth from '~/service/oauth/index';

const app = Express();
const port = process.env.PORT;

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS, PATCH")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === "OPTIONS" || req.method === "OPTIONS") {
        res.sendStatus(200);
        return;
    }
    next();
});

app.oauth = oauth;

// autheticate request with oauth
const AuthenticateRequest = (req, res, next) => {
    if (req.path.split('/')[1] !== 'protected') {
        return next();
    }
    const request = new Request(req);
    const response = new Response(res);
    app.oauth.authenticate(request, response)
        .then(() => next())
        .catch(function (err) { res.status(err.code || 500).json(err) })
};

app.use(AuthenticateRequest);

// provide token
app.all('/oauth/token', (req, res) => {
    const request = new Request(req);
    const response = new Response(res);
    return app.oauth.token(request, response)
        .then(function (token) {
            res.json(token);
        })
        .catch(function (err) {
            res.status(err.code || 500).json(err);
        })
});
app.use('/ping', PingRouter);

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})