import { Router } from 'express';
import { UserController } from '~/controller/index';

const UserRouter = new Router();

UserRouter
    .post('/', UserController.createUser)
    .get('/:id/', UserController.getUserById)
    .get('/manager/:userId/', UserController.isManager)

export default UserRouter;