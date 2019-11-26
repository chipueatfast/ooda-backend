import { initSequelize } from '~/db/sequelize';
import User from './UserModel';
import LeaveRequest from './LeaveRequestModel';
import PerformanceReview from './PerformanceReviewModel';

const tables = {};

export function initTables() {
    initSequelize();
    tables.User = User();
    tables.LeaveRequest = LeaveRequest();
    tables.PerformanceReview = PerformanceReview();
}

export default () => tables;

