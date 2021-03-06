import { Router } from 'express';
import { PerformanceReviewController } from '~/controller/index';

import { IdGuardMiddlewareGuard, OauthMiddlewareGuard, RoleBasedMiddlewareGuard } from '~/service/guard/index';

const PerformanceReviewRouter = new Router();

PerformanceReviewRouter
    .use('/', OauthMiddlewareGuard)
    .get('/employee/:userId/', IdGuardMiddlewareGuard('userId'))
    .get('/employee/:userId/', PerformanceReviewController.getPRHistory)

    .use('/manager/:managerId/', IdGuardMiddlewareGuard('managerId'))
    .get('/manager/:managerId/employee/', PerformanceReviewController.getPerformanceReviewableList)
    .get('/manager/:managerId/', PerformanceReviewController.getConductedPR)
    .post('/manager/:managerId/', PerformanceReviewController.createPerformanceReview)
    .patch('/manager/:managerId/', PerformanceReviewController.updatePerformanceReview)

    .use('/hr/', RoleBasedMiddlewareGuard(['hr']))
    .get('/hr/', PerformanceReviewController.getToFinalize)
    .put('/hr/', PerformanceReviewController.finalizePR)
export default PerformanceReviewRouter;