export interface User {
  id: number;
  prefix: string;
  fullName: string;
  department: string;
  position: string;
  rule: RuleUser;
  status: UserStatus;
}

export type UserStatus = "active" | "inactive" | "suspended";

export interface RuleUser {
  id: number;
  name: string;
}
