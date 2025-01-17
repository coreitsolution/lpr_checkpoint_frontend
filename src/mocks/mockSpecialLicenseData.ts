import {
  GroupLicenseName,
  SpecialLicense,
  SpecialLicenseStatusName,
} from "../features/special-license/specialLicenseTypes";

const mockSpecialLicenses: SpecialLicense[] = [
  {
    id: 1,
    licenseId: "8กก 788 กรุงเทพมหานคร",
    provinceId: 1,
    images: ["image1.jpg", "image2.jpg"],
    groupLicense: { id: 1, name: GroupLicenseName.BLACKLIST },
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-02T00:00:00Z",
    owner: "สมชาย ใจดี",
    departmentId: 1,
    status: { id: 1, name: SpecialLicenseStatusName.ACTIVE },
  },
  {
    id: 2,
    licenseId: "7กก 123 กรุงเทพมหานคร",
    provinceId: 2,
    images: ["image3.jpg", "image4.jpg"],
    groupLicense: { id: 2, name: GroupLicenseName.VIP },
    createdAt: "2023-01-03T00:00:00Z",
    updatedAt: "2023-01-04T00:00:00Z",
    owner: "สมหญิง ใจงาม",
    departmentId: 2,
    status: { id: 2, name: SpecialLicenseStatusName.INACTIVE },
  },
  {
    id: 3,
    licenseId: "6ขข 456 เชียงใหม่",
    provinceId: 3,
    images: ["image5.jpg", "image6.jpg"],
    groupLicense: { id: 1, name: GroupLicenseName.BLACKLIST },
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-06T00:00:00Z",
    owner: "สมปอง ใจเย็น",
    departmentId: 3,
    status: { id: 1, name: SpecialLicenseStatusName.ACTIVE },
  },
  {
    id: 4,
    licenseId: "5จจ 789 ภูเก็ต",
    provinceId: 4,
    images: ["image7.jpg", "image8.jpg"],
    groupLicense: { id: 2, name: GroupLicenseName.VIP },
    createdAt: "2023-01-07T00:00:00Z",
    updatedAt: "2023-01-08T00:00:00Z",
    owner: "สมศรี ใจดี",
    departmentId: 4,
    status: { id: 2, name: SpecialLicenseStatusName.INACTIVE },
  },
  {
    id: 5,
    licenseId: "4ดด 321 ชลบุรี",
    provinceId: 5,
    images: ["image9.jpg", "image10.jpg"],
    groupLicense: { id: 1, name: GroupLicenseName.BLACKLIST },
    createdAt: "2023-01-09T00:00:00Z",
    updatedAt: "2023-01-10T00:00:00Z",
    owner: "สมหมาย ใจงาม",
    departmentId: 5,
    status: { id: 1, name: SpecialLicenseStatusName.ACTIVE },
  },
  {
    id: 6,
    licenseId: "3กด 654 นครราชสีมา",
    provinceId: 6,
    images: ["image11.jpg", "image12.jpg"],
    groupLicense: { id: 2, name: GroupLicenseName.VIP },
    createdAt: "2023-01-11T00:00:00Z",
    updatedAt: "2023-01-12T00:00:00Z",
    owner: "สมชาย ใจเย็น",
    departmentId: 6,
    status: { id: 2, name: SpecialLicenseStatusName.INACTIVE },
  },
  {
    id: 7,
    licenseId: "2คง 987 ขอนแก่น",
    provinceId: 7,
    images: ["image13.jpg", "image14.jpg"],
    groupLicense: { id: 1, name: GroupLicenseName.BLACKLIST },
    createdAt: "2023-01-13T00:00:00Z",
    updatedAt: "2023-01-14T00:00:00Z",
    owner: "สมหญิง ใจดี",
    departmentId: 7,
    status: { id: 1, name: SpecialLicenseStatusName.ACTIVE },
  },
  {
    id: 8,
    licenseId: "1จข 123 สุราษฎร์ธานี",
    provinceId: 8,
    images: ["image15.jpg", "image16.jpg"],
    groupLicense: { id: 2, name: GroupLicenseName.VIP },
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-16T00:00:00Z",
    owner: "สมปอง ใจงาม",
    departmentId: 8,
    status: { id: 2, name: SpecialLicenseStatusName.INACTIVE },
  },
  {
    id: 9,
    licenseId: "9คค 111 เชียงราย",
    provinceId: 9,
    images: ["image17.jpg", "image18.jpg"],
    groupLicense: { id: 1, name: GroupLicenseName.BLACKLIST },
    createdAt: "2023-01-17T00:00:00Z",
    updatedAt: "2023-01-18T00:00:00Z",
    owner: "สมศรี ใจเย็น",
    departmentId: 9,
    status: { id: 1, name: SpecialLicenseStatusName.ACTIVE },
  },
  {
    id: 10,
    licenseId: "8ขข 222 สุโขทัย",
    provinceId: 10,
    images: ["image19.jpg", "image20.jpg"],
    groupLicense: { id: 2, name: GroupLicenseName.VIP },
    createdAt: "2023-01-19T00:00:00Z",
    updatedAt: "2023-01-20T00:00:00Z",
    owner: "สมหมาย ใจดี",
    departmentId: 10,
    status: { id: 2, name: SpecialLicenseStatusName.INACTIVE },
  },
  {
    id: 11,
    licenseId: "7ขง 333 ลำปาง",
    provinceId: 11,
    images: ["image21.jpg", "image22.jpg"],
    groupLicense: { id: 1, name: GroupLicenseName.BLACKLIST },
    createdAt: "2023-01-21T00:00:00Z",
    updatedAt: "2023-01-22T00:00:00Z",
    owner: "สมชาย ใจงาม",
    departmentId: 11,
    status: { id: 1, name: SpecialLicenseStatusName.ACTIVE },
  },
  {
    id: 12,
    licenseId: "6ขจ 444 อุบลราชธานี",
    provinceId: 12,
    images: ["image23.jpg", "image24.jpg"],
    groupLicense: { id: 2, name: GroupLicenseName.VIP },
    createdAt: "2023-01-23T00:00:00Z",
    updatedAt: "2023-01-24T00:00:00Z",
    owner: "สมหญิง ใจเย็น",
    departmentId: 12,
    status: { id: 2, name: SpecialLicenseStatusName.INACTIVE },
  },
];

export default mockSpecialLicenses;
