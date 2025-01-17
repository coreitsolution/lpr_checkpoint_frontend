import { SuspectPeopleRespondsDetail, SuspectPeopleData } from "../features/suspect-people/SuspectPeopleDataTypes"

export const suspectPeopleDetail: SuspectPeopleRespondsDetail[] = [
  {
    id: 1,
    title_id: 1,
    firstname: "สมหมาย",
    lastname: "หมายสม",
    idcard_number: "1234567890123",
    address: "123 หมู่ 5 ต.บางเขน อ.เมือง",
    province_id: 10,
    district_id: 101,
    subdistrict_id: 10101,
    zipcode: "10210",
    person_class_id: 1,
    case_number: "CASE12345",
    arrest_warrant_date: "2025-01-01",
    arrest_warrant_expire_date: "2025-12-31",
    behavior: "ลักลอบขนสินค้าเถื่อน",
    case_owner_name: "พ.ต.อ. สมชาย จงรักษ์",
    case_owner_agency: "ตำรวจภูธรจังหวัด",
    case_owner_phone: "0812345678",
    special_suspect_person_images: [{
      createdAt: "2025-01-01T08:00:00Z",
      id: 101,
      notes: null,
      special_plate_id: 1,
      title: "ภาพพิเศษ 1",
      updatedAt: "2025-01-01T08:00:00Z",
      url: "/uploads/image1.png",
    }],
    special_suspect_person_files: [
      {
        createdAt: "2025-01-01T08:00:00Z",
        id: 102,
        notes: "เอกสารการจับกุม",
        special_plate_id: 1,
        title: "เอกสารจับกุม",
        updatedAt: "2025-01-01T08:00:00Z",
        url: "/uploads/file1.pdf",
      },
    ],
    visible: 1,
    active: 1,
    createdAt: "2025-01-01T08:00:00Z",
    updatedAt: "2025-01-01T08:00:00Z",
  },
  {
    id: 2,
    title_id: 2,
    firstname: "ชายเหมือง",
    lastname: "เชียงใหม่",
    idcard_number: "9876543210987",
    address: "45/67 หมู่บ้านสายรุ้ง ต.บางรัก อ.เมือง",
    province_id: 20,
    district_id: 202,
    subdistrict_id: 20202,
    zipcode: "10300",
    person_class_id: 2,
    case_number: "CASE67890",
    arrest_warrant_date: "2024-11-15",
    arrest_warrant_expire_date: "2025-06-15",
    behavior: "ฉ้อโกง",
    case_owner_name: "พ.ต.ท. วิชัย สงเคราะห์",
    case_owner_agency: "สถานีตำรวจนครบาล",
    case_owner_phone: "0897654321",
    special_suspect_person_images: [{
      createdAt: "2024-11-15T10:00:00Z",
      id: 103,
      notes: null,
      special_plate_id: 2,
      title: "ภาพพิเศษ 2",
      updatedAt: "2024-11-15T10:00:00Z",
      url: "/uploads/image2.png",
    }],
    special_suspect_person_files: [
      {
        createdAt: "2024-11-15T10:00:00Z",
        id: 104,
        notes: "เอกสารพยาน",
        special_plate_id: 2,
        title: "คำให้การพยาน",
        updatedAt: "2024-11-15T10:00:00Z",
        url: "/uploads/file2.pdf",
      },
    ],
    visible: 1,
    active: 1,
    createdAt: "2024-11-15T10:00:00Z",
    updatedAt: "2024-11-15T10:00:00Z",
  },
  {
    id: 3,
    title_id: 4,
    firstname: "ชายเรียง",
    lastname: "เชียงราย",
    idcard_number: "5556667778889",
    address: "99/9 หมู่ 2 ต.ท่าช้าง อ.เมือง",
    province_id: 30,
    district_id: 303,
    subdistrict_id: 30303,
    zipcode: "10400",
    person_class_id: 3,
    case_number: "CASE11223",
    arrest_warrant_date: "2025-03-01",
    arrest_warrant_expire_date: "2025-09-01",
    behavior: "ก่อกวนในที่สาธารณะ",
    case_owner_name: "ร.ต.อ. วัฒนา ใจกล้า",
    case_owner_agency: "กองบังคับการตำรวจ",
    case_owner_phone: "0921234567",
    special_suspect_person_images: [{
      createdAt: "2025-03-01T09:30:00Z",
      id: 105,
      notes: null,
      special_plate_id: 3,
      title: "ภาพพิเศษ 3",
      updatedAt: "2025-03-01T09:30:00Z",
      url: "/uploads/image3.png",
    }],
    special_suspect_person_files: [
      {
        createdAt: "2025-03-01T09:30:00Z",
        id: 106,
        notes: "รูปถ่ายที่เกิดเหตุ",
        special_plate_id: 3,
        title: "หลักฐานภาพถ่าย",
        updatedAt: "2025-03-01T09:30:00Z",
        url: "/uploads/file3.png",
      },
    ],
    visible: 1,
    active: 1,
    createdAt: "2025-03-01T09:30:00Z",
    updatedAt: "2025-03-01T09:30:00Z",
  },
  {
    id: 4,
    title_id: 5,
    firstname: "อุตรดิตถ์",
    lastname: "อิตรดุด",
    idcard_number: "1010101010101",
    address: "12/45 ต.ดอนเมือง อ.ดอนเมือง",
    province_id: 40,
    district_id: 404,
    subdistrict_id: 40404,
    zipcode: "10500",
    person_class_id: 2,
    case_number: "CASE44556",
    arrest_warrant_date: "2025-05-15",
    arrest_warrant_expire_date: "2025-11-15",
    behavior: "ค้าสิ่งของผิดกฎหมาย",
    case_owner_name: "ด.ต. ทองสุข แก้วใส",
    case_owner_agency: "สถานีตำรวจภูธร",
    case_owner_phone: "0919876543",
    special_suspect_person_images: [{
      createdAt: "2025-05-15T12:45:00Z",
      id: 107,
      notes: null,
      special_plate_id: 4,
      title: "ภาพพิเศษ 4",
      updatedAt: "2025-05-15T12:45:00Z",
      url: "/uploads/image4.png",
    }],
    special_suspect_person_files: [
      {
        createdAt: "2025-05-15T12:45:00Z",
        id: 108,
        notes: "ข้อมูลพยานหลักฐาน",
        special_plate_id: 4,
        title: "เอกสารพยาน",
        updatedAt: "2025-05-15T12:45:00Z",
        url: "/uploads/file4.docx",
      },
    ],
    visible: 1,
    active: 1,
    createdAt: "2025-05-15T12:45:00Z",
    updatedAt: "2025-05-15T12:45:00Z",
  },
  {
    id: 5,
    title_id: 6,
    firstname: "โต๊ะหนึ่ง",
    lastname: "ตึ่งโน๊ะ",
    idcard_number: "2020202020202",
    address: "67/89 หมู่ 8 ต.สะพานสูง อ.เมือง",
    province_id: 50,
    district_id: 505,
    subdistrict_id: 50505,
    zipcode: "10600",
    person_class_id: 3,
    case_number: "CASE77889",
    arrest_warrant_date: "2025-07-20",
    arrest_warrant_expire_date: "2026-01-20",
    behavior: "ทำลายทรัพย์สินทางราชการ",
    case_owner_name: "พ.ต.ต. สรวิชญ์ พิพัฒน์",
    case_owner_agency: "สถานีตำรวจ",
    case_owner_phone: "0931234567",
    special_suspect_person_images: [{
      createdAt: "2025-07-20T15:00:00Z",
      id: 109,
      notes: null,
      special_plate_id: 5,
      title: "ภาพพิเศษ 5",
      updatedAt: "2025-07-20T15:00:00Z",
      url: "/uploads/image5.png",
    }],
    special_suspect_person_files: [
      {
        createdAt: "2025-07-20T15:00:00Z",
        id: 110,
        notes: "รายงานเหตุการณ์",
        special_plate_id: 5,
        title: "รายงาน",
        updatedAt: "2025-07-20T15:00:00Z",
        url: "/uploads/file5.pdf",
      },
    ],
    visible: 1,
    active: 1,
    createdAt: "2025-07-20T15:00:00Z",
    updatedAt: "2025-07-20T15:00:00Z",
  },
];

export const suspectPeopledata: SuspectPeopleData = {
  data: suspectPeopleDetail
}