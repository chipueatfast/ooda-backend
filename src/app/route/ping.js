import { Router } from 'express';
import { PingController } from '~/controller/index';
import { RoleBasedMiddlewareGuard } from '~/service/guard/index';

const PingRouter = new Router();

PingRouter
    .use(RoleBasedMiddlewareGuard(['hr']))
    .get('/', PingController.ping);

export default PingRouter;