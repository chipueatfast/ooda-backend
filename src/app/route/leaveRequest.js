import { Router } from 'express';
import { LeaveRequestController } from '~/controller/index';

import { IdGuardMiddlewareGuard, OauthMiddlewareGuard } from '~/service/guard/index';

const LeaveRequestRouter = new Router();

LeaveRequestRouter
    .use('/', OauthMiddlewareGuard)

    .use('/employee/:userId/', IdGuardMiddlewareGuard('userId'))
    .get('/employee/:userId/', LeaveRequestController.getLeaveRequestByUserId)
    .post('/employee/:userId/', LeaveRequestController.createLeaveRequest)

    .use('/manager/:managerId/', IdGuardMiddlewareGuard('managerId'))
    .get('/manager/:managerId/', LeaveRequestController.getLeaveRequestByManager)
    .patch('/manager/:managerId/', LeaveRequestController.updateLeaveRequest)
    
    

 
    

export default LeaveRequestRouter;