import { User, UserStatus, RuleUser } from '../features/user-management/userManagementTypes';

const ruleAdmin: RuleUser = { id: 1, name: 'admin' };
const ruleUser: RuleUser = { id: 2, name: 'user' };

export const mockUserManagementData: User[] = [
    {
        id: 1,
        prefix: 'นาย',
        fullName: 'สมชาย ใจดี',
        department: 'ไอที',
        position: 'ผู้ดูแลระบบ',
        rule: ruleAdmin,
        status: 'active' as UserStatus
    },
    {
        id: 2,
        prefix: 'นางสาว',
        fullName: 'สมหญิง สมบูรณ์',
        department: 'ทรัพยากรบุคคล',
        position: 'ผู้เชี่ยวชาญด้านทรัพยากรบุคคล',
        rule: ruleUser,
        status: 'active' as UserStatus
    },
    {
        id: 3,
        prefix: 'นาย',
        fullName: 'สมปอง สมใจ',
        department: 'การเงิน',
        position: 'นักบัญชี',
        rule: ruleUser,
        status: 'inactive' as UserStatus
    },
    {
        id: 4,
        prefix: 'นางสาว',
        fullName: 'สมศรี สมหมาย',
        department: 'การตลาด',
        position: 'นักการตลาด',
        rule: ruleUser,
        status: 'active' as UserStatus
    },
    {
        id: 5,
        prefix: 'นาย',
        fullName: 'สมชาย สมศักดิ์',
        department: 'วิศวกรรม',
        position: 'วิศวกร',
        rule: ruleUser,
        status: 'inactive' as UserStatus
    },
    {
        id: 6,
        prefix: 'นางสาว',
        fullName: 'สมฤดี สมบัติ',
        department: 'บริการลูกค้า',
        position: 'ผู้ให้บริการลูกค้า',
        rule: ruleUser,
        status: 'active' as UserStatus
    },
    {
        id: 7,
        prefix: 'นาย',
        fullName: 'สมพงษ์ สมประสงค์',
        department: 'พัฒนาธุรกิจ',
        position: 'นักพัฒนาธุรกิจ',
        rule: ruleUser,
        status: 'inactive' as UserStatus
    },
    {
        id: 8,
        prefix: 'นางสาว',
        fullName: 'สมพร สมบูรณ์',
        department: 'วิจัยและพัฒนา',
        position: 'นักวิจัย',
        rule: ruleUser,
        status: 'active' as UserStatus
    },
    {
        id: 9,
        prefix: 'นาย',
        fullName: 'สมศักดิ์ สมหมาย',
        department: 'การผลิต',
        position: 'ผู้จัดการการผลิต',
        rule: ruleAdmin,
        status: 'inactive' as UserStatus
    },
    {
        id: 10,
        prefix: 'นางสาว',
        fullName: 'สมฤดี สมศรี',
        department: 'การขาย',
        position: 'ผู้จัดการการขาย',
        rule: ruleAdmin,
        status: 'active' as UserStatus
    }
];