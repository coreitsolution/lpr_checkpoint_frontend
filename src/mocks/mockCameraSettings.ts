import { CameraScreenSettingDetail, CameraDetailSettings, StreamDetail } from "../features/camera-settings/cameraSettingsTypes";

export const cameraDetailSettingsData: CameraDetailSettings[] =
Array.from({length:3}, (_, i) => (
  {
    id: i + 1,
    cam_id: "CAM-102",
    cam_uid: "UID98765",
    checkpoint_name:  (i + 1) % 2 === 0 ? "Checkpoint A" : (i + 1) % 3 === 0 ? "Checkpoint C" : "Checkpoint B",
    division_id: 101,
    province_id: 10,
    district_id: 20,
    sub_district_id: 30,
    number_of_detections: 150,
    route: "Route 66",
    latitude: "13.7563",
    longitude: "100.5018",
    rtsp_live_url: "rtsp://viewer:Lprviewer@58.136.154.95:8554/live",
    rtsp_process_url: "rtsp://192.168.1.10/process",
    stream_encode_id: 1,
    stream_encode: {
      "id": 1,
      "name": "H264",
      "gstreamer_format": "",
      "visible": true,
      "active": true
    },
    api_server_url: "https://api.server.url",
    live_server_url: "https://live.server.url",
    live_stream_url: "ws://58.136.154.95:10002",
    wsport: 8080,
    pc_serial_number: "PC123456789",
    license_key: "LICENSE-XYZ-987",
    officer_title_id: 1,
    officer_firstname: "John",
    officer_lastname: "Doe",
    officer_position_id: 2,
    officer_phone: "+1234567890",
    detection_area: "{\"points\":[{\"x\":0,\"y\":93.5},{\"x\":845,\"y\":88.5},{\"x\":848,\"y\":363.5},{\"x\":0,\"y\":366.5},{\"x\":2,\"y\":91.5}],\"frame\":{\"width\":850,\"height\":450}}",
    streaming: true,
    visible: 1,
    active: 1,
    alive: 1,
    alpr_cam_id: 111,
    detecion_count: 0,
    last_online: "2024-12-17T14:35:00Z",
    last_check: "2024-12-17T15:00:00Z",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-12-17T16:00:00Z",
  }
))

export const cameraScreenSettingDetail: CameraScreenSettingDetail[] = [
  {
    id: 1,
    name: "Live view",
    value: "1",
    description: "Live view",
    created_at: "2024-12-17T14:35:00Z",
    updated_at: "2024-12-17T14:35:00Z",
  }
]

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