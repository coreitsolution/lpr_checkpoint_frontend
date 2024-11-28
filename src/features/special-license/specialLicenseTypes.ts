export enum GroupLicenseName {
  BLACKLIST = "blacklist",
  VIP = "vip",
}

export enum SpecialLicenseStatusName {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface SpecialLicense {
  id: number;
  licenseId: string;
  provinceId: number;
  images: string[];
  groupLicense: GroupLicense;
  createdAt: string;
  updatedAt: string;
  owner: string;
  departmentId: number;
  status: SpecialLicenseStatus;
}

export interface GroupLicense {
  id: number;
  name: GroupLicenseName;
}

export interface SpecialLicenseStatus {
  id: number;
  name: SpecialLicenseStatusName;
}
