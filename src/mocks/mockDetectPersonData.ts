import { DetectPerson } from "../features/detect-person/detectPersonTypes";

export const detectPersonData: DetectPerson[] = [
  {
    id: 1,
    prefix: "นาย",
    firstName: "สมชาย",
    lastName: "ใจดี",
    fullName: "สมชาย ใจดี",
    pathImages: ["/images/detect-person/person1.jpg"],
    accuracy: 98.5,
    directionDetail: [
      {
        color: "orange",
        direction: "NSB 3_บัวลายหนองแวง_ออก",
        dateTime: "2024-11-03 07:00:00",
      },
      {
        color: "purple",
        direction: "NSB 3_บัวลายหนองแวง_ออก",
        dateTime: "2024-11-03 08:30:00",
      },
    ],
    periodTime: "2024-11-01T08:30:00Z",
    dateTime: "01/11/2024",
    time: "08:30:00",
    type: "Blacklist",
    remark: "ไม่มีปัญหา",
  },
  {
    id: 2,
    prefix: "นางสาว",
    firstName: "สุดา",
    lastName: "สุขใจ",
    fullName: "สุดา สุขใจ",
    pathImages: ["/images/detect-person/person2.jpg"],
    accuracy: 95.2,
    directionDetail: [
      {
        color: "red",
        direction: "NSB 3_บัวลายหนองแวง_ออก",
        dateTime: "2024-11-03 09:00:00",
      },
      {
        color: "blue",
        direction: "NSB 3_บัวลายหนองแวง_ออก",
        dateTime: "2024-11-03 09:30:00",
      },
    ],
    periodTime: "2024-11-01T09:00:00Z",
    dateTime: "01/11/2024",
    time: "09:00:00",
    type: "Suspicious",
    remark: "พฤติกรรมสงสัย",
  },
  {
    id: 3,
    prefix: "นาง",
    firstName: "วิภา",
    lastName: "วัฒนากุล",
    fullName: "วิภา วัฒนากุล",
    pathImages: ["/images/detect-person/person3.jpg"],
    accuracy: 97.8,
    directionDetail: [
      {
        color: "green",
        direction: "NSB 3_บัวลายหนองแวง_ออก",
        dateTime: "2024-11-03 10:00:00",
      },
      {
        color: "yellow",
        direction: "NSB 3_บัวลายหนองแวง_ออก",
        dateTime: "2024-11-03 10:30:00",
      },
    ],
    periodTime: "2024-11-01T10:00:00Z",
    dateTime: "01/11/2024",
    time: "10:00:00",
    type: "Normal",
    remark: "ตรวจปกติ",
  },
  {
    id: 4,
    prefix: "นาย",
    firstName: "ชัยณรงค์",
    lastName: "ธรรมวงศ์",
    fullName: "ชัยณรงค์ ธรรมวงศ์",
    pathImages: ["/images/detect-person/person4.jpg"],
    accuracy: 99.0,
    directionDetail: [
      {
        color: "purple",
        direction: "NSB 3_บัวลายหนองแวง_ออก",
        dateTime: "2024-11-03 11:00:00",
      },
      {
        color: "pink",
        direction: "NSB 3_บัวลายหนองแวง_ออก",
        dateTime: "2024-11-03 11:30:00",
      },
    ],
    periodTime: "2024-11-01T11:15:00Z",
    dateTime: "01/11/2024",
    time: "11:15:00",
    type: "Blacklist",
    remark: "ไม่มีหมายเหตุ",
  },
  {
    id: 5,
    prefix: "นาง",
    firstName: "กานดา",
    lastName: "รุ่งเรือง",
    fullName: "กานดา รุ่งเรือง",
    pathImages: ["/images/detect-person/person5.jpg"],
    accuracy: 92.5,
    directionDetail: [
      {
        color: "orange",
        direction: "NSB 3_บัวลายหนองแวง_ออก",
        dateTime: "2024-11-03 12:00:00",
      },
      {
        color: "gray",
        direction: "NSB 3_บัวลายหนองแวง_ออก",
        dateTime: "2024-11-03 12:30:00",
      },
    ],
    periodTime: "2024-11-01T12:30:00Z",
    dateTime: "01/11/2024",
    time: "12:30:00",
    type: "Monitoring",
    remark: "ต้องการติดตามเพิ่มเติม",
  },
  {
    id: 6,
    prefix: "นางสาว",
    firstName: "พิมพ์ใจ",
    lastName: "พิพัฒน์",
    fullName: "พิมพ์ใจ พิพัฒน์",
    pathImages: ["/images/detect-person/person6.jpg"],
    accuracy: 96.4,
    directionDetail: [
      {
        color: "blue",
        direction: "Southwest",
        dateTime: "2024-11-03 13:00:00",
      },
      { color: "red", direction: "North", dateTime: "2024-11-03 13:30:00" },
    ],
    periodTime: "2024-11-01T13:00:00Z",
    dateTime: "01/11/2024",
    time: "13:00:00",
    type: "Normal",
    remark: "ไม่มีปัญหา",
  },
  {
    id: 7,
    prefix: "นาย",
    firstName: "วิทยา",
    lastName: "ชาญวิทย์",
    fullName: "วิทยา ชาญวิทย์",
    pathImages: ["/images/detect-person/person7.jpg"],
    accuracy: 94.7,
    directionDetail: [
      { color: "yellow", direction: "East", dateTime: "2024-11-03 14:00:00" },
      { color: "green", direction: "South", dateTime: "2024-11-03 14:30:00" },
    ],
    periodTime: "2024-11-01T13:30:00Z",
    dateTime: "01/11/2024",
    time: "13:30:00",
    type: "Normal",
    remark: "ตรวจปกติ",
  },
  {
    id: 8,
    prefix: "นางสาว",
    firstName: "รัตนา",
    lastName: "รัตนชาติ",
    fullName: "รัตนา รัตนชาติ",
    pathImages: ["/images/detect-person/person8.jpg"],
    accuracy: 97.3,
    directionDetail: [
      {
        color: "purple",
        direction: "NSB 3_บัวลายหนองแวง_ออก",
        dateTime: "2024-11-03 15:00:00",
      },
      {
        color: "orange",
        direction: "NSB 3_บัวลายหนองแวง_ออก",
        dateTime: "2024-11-03 15:30:00",
      },
    ],
    periodTime: "2024-11-01T14:00:00Z",
    dateTime: "01/11/2024",
    time: "14:00:00",
    type: "Suspicious",
    remark: "พบวัตถุต้องสงสัย",
  },
  {
    id: 9,
    prefix: "นาง",
    firstName: "พวงเพ็ญ",
    lastName: "วงศ์สวัสดิ์",
    fullName: "พวงเพ็ญ วงศ์สวัสดิ์",
    pathImages: ["/images/detect-person/person9.jpg"],
    accuracy: 99.2,
    directionDetail: [
      {
        color: "pink",
        direction: "NSB 3_บัวลายหนองแวง_ออก",
        dateTime: "2024-11-03 16:00:00",
      },
      { color: "blue", direction: "South", dateTime: "2024-11-03 16:30:00" },
    ],
    periodTime: "2024-11-01T14:30:00Z",
    dateTime: "01/11/2024",
    time: "14:30:00",
    type: "Normal",
    remark: "ไม่มีปัญหา",
  },
  {
    id: 10,
    prefix: "นาย",
    firstName: "ณัฐวุฒิ",
    lastName: "วัฒนธรรม",
    fullName: "ณัฐวุฒิ วัฒนธรรม",
    pathImages: ["/images/detect-person/person10.jpg"],
    accuracy: 91.0,
    directionDetail: [
      { color: "red", direction: "East", dateTime: "2024-11-03 17:00:00" },
      {
        color: "orange",
        direction: "Southwest",
        dateTime: "2024-11-03 17:30:00",
      },
    ],
    periodTime: "2024-11-01T15:00:00Z",
    dateTime: "01/11/2024",
    time: "15:00:00",
    type: "Blacklist",
    remark: "บุคคลไม่ระบุชื่อ",
  },
];
