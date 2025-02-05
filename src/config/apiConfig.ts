const IP = "localhost"
const BASE_URL = `http://${IP}:3000`
const IMAGE_BASE_URL = `http://${IP}:3101`
const FILE_UPLOAD_BASE_URL = `http://${IP}:3000`
const STREAM_BASE_URL = `http://${IP}:3103`
const TELEGRAM_BASE_URL = `http://${IP}:3050`
const WEB_SOCKET_SERVICE_REALTIME = `ws://${IP}:8085`
const API_VERSION = '/v1'
const BASE_TELEGRAM_CHAT_ID = "-4682289114"

export const TELEGRAM_TOKEN = "eb1b94cfd6971df4a73991580e1664cfbd8d830c5bd784e92ead3d7de9a9c874"
export const IMAGE_URL = IMAGE_BASE_URL
export const FILE_URL = FILE_UPLOAD_BASE_URL
export const STREAM_URL = `${STREAM_BASE_URL}/api${API_VERSION}`
export const API_URL = `${BASE_URL}/lpr-node-api/api${API_VERSION}`
export const TELEGRAM_URL = `${TELEGRAM_BASE_URL}/bot`
export const WEB_SOCKET_SERVICE = WEB_SOCKET_SERVICE_REALTIME
export const TELEGRAM_CHAT_ID = BASE_TELEGRAM_CHAT_ID