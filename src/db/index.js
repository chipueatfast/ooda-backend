import { initSequelize } from '~/db/sequelize';
import User from './UserModel';
import LeaveRequest from './LeaveRequestModel';

const tables = {};

export function initTables() {
    initSequelize();
    tables.User = User();
    tables.LeaveRequest = LeaveRequest();
}

export default () => tables;

