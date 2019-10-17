import { Router } from 'express';
import { PingController } from '~/controller/index';

const PingRouter = new Router();

PingRouter.get('/', PingController.ping);

export default PingRouter;