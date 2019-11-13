import Express from 'express';
import bodyParser from 'body-parser';
import {Request, Response} from 'oauth2-server';
import { PingRouter, UserRouter } from './route/index';
import oauth from '~/service/oauth/index';
import { CORSPolicyGuard } from '~/service/guard';
import { initTables } from '~/db/index';

const app = Express();
const port = process.env.PORT;
initTables();


// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "DELETE, POST, PUT, GET, OPTIONS, PATCH")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS" || req.method === "OPTIONS") {
        res.sendStatus(200);
        return;
    }
    next();
});

app.oauth = oauth;

app.use(CORSPolicyGuard);

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
app.use('/protected/ping', PingRouter);
app.use('/user',UserRouter);

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})