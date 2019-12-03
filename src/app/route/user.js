import { Router } from 'express';
import { UserController } from '~/controller/index';

import { OauthMiddlewareGuard, RoleBasedMiddlewareGuard, IdGuardMiddlewareGuard } from '~/service/guard/index';

const UserRouter = new Router();

UserRouter
    .use('/', OauthMiddlewareGuard)
    .patch('/password/:userId/', IdGuardMiddlewareGuard('userId'))
    .patch('/password/:userId/', UserController.changePassword)

    .get('/manager/:userId/', UserController.isManager)
    .use('/employee/', RoleBasedMiddlewareGuard(['hr']))
    .post('/employee/', UserController.createUser)
    .get('/employee/', UserController.findAllEmployees)
    .patch('/employee/', UserController.updateEmployeeInfo)
    

export default UserRouter;