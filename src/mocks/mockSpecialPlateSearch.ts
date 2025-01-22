import { LastRecognitionData } from "../features/live-view-real-time/liveViewRealTimeTypes"

export const specialPlateSearchData: LastRecognitionData[] = 
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    camera_info: {
      id: 1,
      cam_id: "cam-106",
    },
    epoch_start: "2024-12-06T13:55:46.000Z",
    camera_id: 5,
    plate: `AB${Math.ceil(Math.random() * 9999)}`,
    plate_confidence: `${(Math.random() * 100).toFixed(2)}%`,
    gps_latitude: 13.7563,
    gps_longitude: 100.5018,
    is_special_plate: i % 2 === 0,
    plate_image: i % 2 === 0
      ? "/lpr_images/2024-12-06/plate_images/20241206-135555.8IhJ9lKGAUWbggPO_plate.jpg"
      : "/lpr_images/2025-01-02/plate_images/20250102-110735.leQcmXOaSzWLMRYp_plate.jpg",
    region_info: {
      id: 1,
      name_th: "กรุงเทพมหานคร",
    },
    vehicle_body_type: "Sedan",
    vehicle_body_type_info: {
      id: 10,
      body_type: "sedan-standard",
      body_type_th: "รถยนต์นั่งส่วนบุคคล",
    },
    vehicle_color: "Black",
    vehicle_color_info: {
      id: 1,
      color: "black",
      color_th: "ดำ",
    },
    vehicle_image: i % 2 === 0
      ? "/lpr_images/2024-12-06/vehicle_images/20241206-135555.8IhJ9lKGAUWbggPO_vehicle.jpg"
      : "/lpr_images/2025-01-02/vehicle_images/20250102-110722.4BHYfWA03VvrXJGS_vehicle.jpg",
    vehicle_make: "Toyota",
    vehicle_make_info: {
      id: 130,
      make: "toyota",
      make_en: "Toyota",
    },
    vehicle_make_model: "Camry",
    vehicle_model_info: {
      id: 1140,
      make: "toyota",
      model: "toyota_corolla",
      model_en: "Toyota Corolla",
    },
    special_plate_id: i + 1000,
    special_plate: {
      id: 11,
      plate_group: "1กศ",
      plate_number: "1270",
      province_id: 20,
      plate_class_id: 3,
      case_number: "5555555",
      arrest_warrant_date: "2024-12-20",
      arrest_warrant_expire_date: "2025-12-31",
      behavior: "-",
      case_owner_name: "นาย สมมุต",
      case_owner_agency: "หน่วยงานที่ 1",
      case_owner_phone: "081-111-1111",
      visible: 1,
      active: 1,
      deleted: true,
      deleted_by_id: 0,
      createdAt: "2024-12-20T04:34:16.000Z",
      updatedAt: "2025-01-08T09:46:17.000Z",
      deletedAt: "2025-01-08T09:46:17.000Z",
      plate_class_info: {
        id: 3,
        title_en: "Blacklist",
        title_th: "บุคคลเฝ้าระวัง",
        visible: 1,
        active: 1,
      },
    },
  }));
