import { CameraSettings, CameraDetailSetting, StreamDetail } from "../features/camera-settings/cameraSettingsTypes";

export const cameraSettingsData: CameraSettings[] = [
  {
    id: 1,
    camera_status: 1,
    checkpoint_id: "CAM-102",
    checkpoint: "Checkpoint A",
    port: "9102",
    latitude: "13.7563",
    longtitude: "100.5018",
    number_of_detections: 150,
    police_division: "กองบัญชาการตำรวจภูธรภาค 1",
    province: "เชียงใหม่",
    district: "แม่ออน",
    sub_district: "แม่ทา",
    route: "Route 1",
    rtsp_live_view: "rtsp://viewer:Lprviewer@58.136.154.95:8554/live",
    rtsp_process: "rtsp://192.168.1.10/process",
    stream_encode: "H.264",
    api_server: "http://api.example.com",
    pc_serial_number: "SN12345",
    license: "Licensed",
    api_server_status: 1,
    sync_data_status: 1,
    license_status: 1,
    officer: {
      prefix: "สิบโท",
      name: "John",
      surname: "Doe",
      position: "พลตรี",
      phone: "0812345678",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    camera_status: 0,
    checkpoint_id: "CP002",
    checkpoint: "Checkpoint B",
    port: "9106",
    latitude: "14.0200",
    longtitude: "100.7278",
    number_of_detections: 75,
    police_division: "กองบัญชาการตำรวจภูธรภาค 1",
    province: "เชียงใหม่",
    district: "แม่ออน",
    sub_district: "ออนเหนือ",
    route: "Route 2",
    rtsp_live_view: "rtsp://viewer:Lprviewer@58.136.154.95:8554/live",
    rtsp_process: "rtsp://192.168.2.20/process",
    stream_encode: "H.265",
    api_server: "http://api.nonexistent.com",
    pc_serial_number: "SN67890",
    license: "Unlicensed",
    api_server_status: 1,
    sync_data_status: 0,
    license_status: 0,
    officer: {
      prefix: "สิบเอก",
      name: "Jane",
      surname: "Smith",
      position: "พลตรี",
      phone: "0898765432",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    camera_status: 1,
    checkpoint_id: "CP003",
    checkpoint: "Checkpoint B",
    port: "9125",
    latitude: "14.0200",
    longtitude: "100.7278",
    number_of_detections: 75,
    police_division: "กองบัญชาการตำรวจภูธรภาค 1",
    province: "เชียงใหม่",
    district: "แม่ออน",
    sub_district: "ออนเหนือ",
    route: "Route 2",
    rtsp_live_view: "rtsp://viewer:Lprviewer@58.136.154.95:8554/live",
    rtsp_process: "rtsp://192.168.2.20/process",
    stream_encode: "H.265",
    api_server: "http://api.nonexistent.com",
    pc_serial_number: "SN67890",
    license: "Unlicensed",
    api_server_status: 1,
    sync_data_status: 0,
    license_status: 0,
    officer: {
      prefix: "สิบเอก",
      name: "Jane",
      surname: "Smith",
      position: "พลตรี",
      phone: "0898765432",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    camera_status: 1,
    checkpoint_id: "CP004",
    checkpoint: "Checkpoint B",
    port: "9125",
    latitude: "14.0200",
    longtitude: "100.7278",
    number_of_detections: 75,
    police_division: "กองบัญชาการตำรวจภูธรภาค 1",
    province: "เชียงใหม่",
    district: "แม่ออน",
    sub_district: "ออนเหนือ",
    route: "Route 2",
    rtsp_live_view: "rtsp://viewer:Lprviewer@58.136.154.95:8554/live",
    rtsp_process: "rtsp://192.168.2.20/process",
    stream_encode: "H.265",
    api_server: "http://api.nonexistent.com",
    pc_serial_number: "SN67890",
    license: "Unlicensed",
    api_server_status: 1,
    sync_data_status: 0,
    license_status: 0,
    sensor_setting: {
      "coordinate": [
          {
              "x": 185,
              "y": 135.5
          },
          {
              "x": 118,
              "y": 57.5
          },
          {
              "x": 346,
              "y": 72.5
          },
          {
              "x": 327,
              "y": 107.5
          },
          {
              "x": 431,
              "y": 131.5
          },
          {
              "x": 522,
              "y": 63.5
          },
          {
              "x": 627,
              "y": 35.5
          },
          {
              "x": 694,
              "y": 80.5
          },
          {
              "x": 636,
              "y": 156.5
          },
          {
              "x": 710,
              "y": 188.5
          },
          {
              "x": 684,
              "y": 297.5
          },
          {
              "x": 528,
              "y": 346.5
          },
          {
              "x": 297,
              "y": 323.5
          },
          {
              "x": 190,
              "y": 292.5
          },
          {
              "x": 128,
              "y": 262.5
          },
          {
              "x": 116,
              "y": 181.5
          },
          {
              "x": 189,
              "y": 151.5
          },
          {
              "x": 184,
              "y": 131.5
          }
      ],
      "fWidth": 850,
      "fHeight": 450
    },
    officer: {
      prefix: "สิบเอก",
      name: "Jane",
      surname: "Smith",
      position: "พลตรี",
      phone: "0898765432",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const cameraDetailSettingsData: CameraDetailSetting[] = [
  {
    id: 1,
    screen: 3,
    cameraSettings: cameraSettingsData
  },
];

export const streamDetailData: StreamDetail[] = [
  {
    uid: '260f15af-a923-43ca-9ff5-31045ae92d76',
    name: 'CAM-102',
    streamUrl: 'rtsp://viewer:Lprviewer@58.136.154.95:8554/live',
    wsPort: '9102',
    ffmpegOptions: {
      '-stats': '',
      '-r': 30,
      '-vf': 'scale=-1:720',
      '-preset': 'high',
      '-tune': 'film',
      '-reconnect': '1',
      '-reconnect_streamed': '1',
      '-reconnect_delay_max': '2',
    },
  },
  {
    uid: '260f15af-a923-43ca-9ff5-31045ae92d77',
    name: 'CAM-106',
    streamUrl: 'rtsp://viewer:Lprviewer@58.136.154.95:8554/live',
    wsPort: '9106',
    ffmpegOptions: {
      '-stats': '',
      '-r': 30,
      '-vf': 'scale=-1:720',
      '-preset': 'high',
      '-tune': 'film',
      '-reconnect': '1',
      '-reconnect_streamed': '1',
      '-reconnect_delay_max': '2',
    },
  },
  {
    uid: '7fe28328-290f-48ae-be2d-b8c4fd71668c',
    name: 'CAM-125',
    streamUrl: 'rtsp://viewer:Lprviewer@58.136.154.95:8554/live',
    wsPort: '9125',
    ffmpegOptions: {
      '-stats': '',
      '-r': 30,
      '-vf': 'scale=-1:720',
      '-preset': 'high',
      '-tune': 'film',
      '-reconnect': '1',
      '-reconnect_streamed': '1',
      '-reconnect_delay_max': '2',
    },
  },
  {
    uid: '5555555-290f-48ae-be2d-b8c4fd71668c',
    name: 'CAM-555',
    streamUrl: 'rtsp://viewer:Lprviewer@58.136.154.95:9999/live',
    wsPort: '9156',
    ffmpegOptions: {
      '-stats': '',
      '-r': 30,
      '-vf': 'scale=-1:720',
      '-preset': 'high',
      '-tune': 'film',
      '-reconnect': '1',
      '-reconnect_streamed': '1',
      '-reconnect_delay_max': '2',
    },
  },
];